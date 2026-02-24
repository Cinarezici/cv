# AI Motivation Letter & Company Research Sistemi
## Tam Uygulama Spesifikasyonu — Antigravity Build Sistemi için
### Version 1.0 | Build-Ready | Her karar verilmiş, her satır açıklanmış

> **Bu doküman, mevcut CV Builder / Resume Optimizer SaaS platformuna "Motivasyon Mektubu" modülünü eklemek için gereken tam teknik ve ürün tasarımını içerir. Apify entegrasyonu, AI mektup üretimi, PDF oluşturma, dashboard yönetimi ve monetizasyon mantığının tamamı kod seviyesinde açıklanmıştır. Hiçbir şeyi varsayıma bırakma.**

---

## İçindekiler

1. [Sistem Genel Bakışı & Mimari](#1-sistem-genel-bakışı--mimari)
2. [Veritabanı Şeması — Supabase](#2-veritabanı-şeması--supabase)
3. [Adım 1: Şirket Araştırma Motoru — Apify Entegrasyonu](#3-adım-1-şirket-araştırma-motoru--apify-entegrasyonu)
4. [Adım 2: AI Mektup Üretim Motoru](#4-adım-2-ai-mektup-üretim-motoru)
5. [Adım 3: PDF Oluşturma Motoru](#5-adım-3-pdf-oluşturma-motoru)
6. [Adım 4: "Motivasyon Mektuplarım" Dashboard Sayfası](#6-adım-4-motivasyon-mektuplarım-dashboard-sayfası)
7. [Tam UX Akışı — Ekran Ekran](#7-tam-ux-akışı--ekran-ekran)
8. [API Route Katmanı — Tüm Endpoint'ler](#8-api-route-katmanı--tüm-endpointler)
9. [Pro Plan & Monetizasyon Sistemi](#9-pro-plan--monetizasyon-sistemi)
10. [Hata Yönetimi & Edge Cases](#10-hata-yönetimi--edge-cases)
11. [Environment Variables & Güvenlik](#11-environment-variables--güvenlik)
12. [Uygulama Sırası — Adım Adım Checklist](#12-uygulama-sırası--adım-adım-checklist)

---

## 1. Sistem Genel Bakışı & Mimari

### 1.1 Modülün Yaptığı Şey

Bu modül, kullanıcının şirket URL'si veya adı girerek:
1. O şirket hakkında otomatik web araştırması yapmasını (Apify)
2. Araştırılan şirket verisine dayalı, kişiselleştirilmiş motivasyon mektubu üretmesini (Claude/OpenAI)
3. Üretilen mektubu profesyonel PDF'e dönüştürmesini (Puppeteer)
4. Tüm mektuplarını özel bir dashboard'da yönetmesini sağlar

Birden fazla şirket için aynı anda (batch) bu süreç çalışabilir.

### 1.2 Teknoloji Stack

```
Apify Actors (Şirket araştırma):
  - apify/website-content-crawler  → Şirket web sitesini tara
  - apify/web-scraper              → Fallback / ek veri
  
AI Mektup Üretimi:
  - Anthropic Claude API (claude-sonnet-4-6) → Birincil tercih
  - OpenAI GPT-4o                            → Fallback
  
PDF Oluşturma:
  - Puppeteer (sunucu tarafı, headless Chrome)
  - pdf-lib (ek watermark / manipülasyon için)
  
Dosya Depolama:
  - Supabase Storage (PDF'ler için)
  
Veritabanı:
  - Supabase (PostgreSQL)
  
Backend:
  - Next.js 14 API Routes (Node.js runtime)
  
Frontend:
  - React + Next.js App Router
  - Tailwind CSS + shadcn/ui
```

### 1.3 Tam Sistem Veri Akışı

```
KULLANICI
  │
  ▼
[Şirket URL'si / adı gir + CV seç + hedef pozisyon yaz]
  │
  ▼
[Apify: apify/website-content-crawler]
  → Şirket web sitesini tara (max 5 sayfa)
  → Misyon, değerler, ürünler, haberler, kültür metni
  → Ham metin → Yapılandırılmış CompanyProfile JSON
  │
  ▼
[AI Mektup Üretici: Claude API]
  → CompanyProfile + CV içeriği + hedef pozisyon + ton seçimi
  → Sistem prompt'u ile STAR-format, şirkete özel mektup üret
  → Düz metin + HTML output
  │
  ▼
[Puppeteer PDF Oluşturucu]
  → HTML → PDF (A4, profesyonel layout)
  → Seçilen şablona göre stil uygula
  → Supabase Storage'a yükle
  │
  ▼
[Veritabanına kayıt: motivation_letters tablosu]
  → motivation_letters dashboard'unda listele
  → İndirme linki + paylaşım linki oluştur
```

---

## 2. Veritabanı Şeması — Supabase

### 2.1 Tablo: `company_profiles`

Araştırılan şirketlerin yapılandırılmış verisi buraya kaydedilir. Aynı şirket için tekrar araştırma yapılmasını önlemek için cache görevi görür.

```sql
CREATE TABLE company_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Şirket kimliği
  company_name TEXT NOT NULL,
  company_url TEXT,                        -- "https://trendyol.com"
  company_domain TEXT,                     -- "trendyol.com" (normalize edilmiş)
  
  -- Araştırma verisi (Apify'den gelen ham + işlenmiş)
  raw_scraped_text TEXT,                   -- Ham scrape metni (debug için)
  structured_profile JSONB NOT NULL,       -- CompanyProfile JSON objesi (aşağıda tanımlı)
  
  -- Metadata
  scrape_status TEXT CHECK (scrape_status IN ('pending', 'running', 'completed', 'failed'))
                DEFAULT 'pending',
  apify_run_id TEXT,                       -- Apify run ID (polling için)
  apify_dataset_id TEXT,                   -- Apify dataset ID
  scrape_error TEXT,                       -- Hata mesajı (varsa)
  
  -- Cache: aynı domain için son 24 saat içinde araştırıldıysa tekrar scrape etme
  scraped_at TIMESTAMPTZ,
  cache_expires_at TIMESTAMPTZ,            -- scraped_at + 24 saat
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index: aynı domain için cache sorgusu
CREATE INDEX idx_company_profiles_domain ON company_profiles(company_domain);
CREATE INDEX idx_company_profiles_user ON company_profiles(user_id);

-- RLS
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own company profiles" ON company_profiles
  FOR ALL USING (auth.uid() = user_id);
```

### 2.2 Tablo: `motivation_letters`

Her üretilen motivasyon mektubunun kaydı.

```sql
CREATE TABLE motivation_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- İlişkiler
  company_profile_id UUID REFERENCES company_profiles(id),
  cv_id UUID REFERENCES cvs(id),           -- Hangi CV baz alındı
  
  -- Mektup içeriği
  company_name TEXT NOT NULL,
  target_role TEXT,                        -- "Senior Product Manager"
  tone TEXT CHECK (tone IN ('corporate', 'startup', 'friendly_formal', 'executive'))
       DEFAULT 'corporate',
  letter_text TEXT NOT NULL,              -- Üretilen mektup düz metin
  letter_html TEXT NOT NULL,              -- Üretilen mektup HTML
  
  -- PDF
  pdf_storage_path TEXT,                  -- Supabase storage path
  pdf_url TEXT,                           -- Public veya signed URL
  pdf_filename TEXT,                      -- "Motivation_Letter_Trendyol.pdf"
  pdf_template_id TEXT DEFAULT 'modern',  -- Kullanılan PDF şablonu
  pdf_generated_at TIMESTAMPTZ,
  
  -- Paylaşım
  share_token TEXT UNIQUE,               -- UUID tabanlı gizli token
  share_url TEXT,                        -- "app.com/ml/share/{share_token}"
  is_public BOOLEAN DEFAULT FALSE,
  share_expires_at TIMESTAMPTZ,          -- Free: 7 gün, Pro: null
  
  -- Durum
  generation_status TEXT CHECK (generation_status IN ('pending', 'researching', 'generating', 'creating_pdf', 'completed', 'failed'))
                    DEFAULT 'pending',
  generation_error TEXT,
  
  -- Batch
  batch_id TEXT,                         -- Birden fazla şirket için aynı batch'te olanlar
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_motivation_letters_user ON motivation_letters(user_id);
CREATE INDEX idx_motivation_letters_company ON motivation_letters(company_name);
CREATE INDEX idx_motivation_letters_status ON motivation_letters(generation_status);
CREATE INDEX idx_motivation_letters_batch ON motivation_letters(batch_id);
CREATE INDEX idx_motivation_letters_share_token ON motivation_letters(share_token);

-- RLS
ALTER TABLE motivation_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own letters" ON motivation_letters
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public letters via token" ON motivation_letters
  FOR SELECT USING (
    is_public = TRUE AND share_token IS NOT NULL
    AND (share_expires_at IS NULL OR share_expires_at > NOW())
  );
```

### 2.3 CompanyProfile JSON Şeması

`company_profiles.structured_profile` alanında saklanan yapılandırılmış veri:

```typescript
interface CompanyProfile {
  // Temel kimlik
  name: string;                    // "Trendyol"
  website: string;                 // "https://trendyol.com"
  industry: string;                // "E-commerce / Technology"
  founded?: string;                // "2010"
  headquartersLocation?: string;   // "Istanbul, Turkey"
  employeeCount?: string;          // "10,000+" veya "50-200"
  
  // Araştırma verisi
  mission?: string;                // Şirketin misyonu (max 300 karakter)
  vision?: string;                 // Şirketin vizyonu
  values: string[];                // ["Innovation", "Customer First", "Data-Driven"]
  products: string[];              // ["Trendyol App", "Trendyol Go", "Dolap"]
  recentNews: string[];            // Son haberler / duyurular (max 3 madde)
  cultureIndicators: string[];     // ["Remote-friendly", "Agile", "Fast-paced startup culture"]
  techStack?: string[];            // Teknik roller için: ["Python", "React", "Kubernetes"]
  
  // Bağlam
  painPoints?: string[];           // Şirketin büyüme sorunları / odaklandığı alanlar
  competitivePosition?: string;    // Pazar konumlandırması
  keyAchievements?: string[];      // Önemli başarılar
  
  // Araştırma kalitesi
  dataQualityScore: number;        // 0-100 — ne kadar zengin veri bulundu
  scrapedPages: string[];          // Hangi URL'ler tarandı
  scrapedAt: string;               // ISO timestamp
}
```

---

## 3. Adım 1: Şirket Araştırma Motoru — Apify Entegrasyonu

### 3.1 Kullanılan Apify Actor

**Primary Actor:** `apify/website-content-crawler`
- Actor ID: `apify~website-content-crawler`
- Şirket web sitesini tarar, tüm metni Markdown formatında döndürür
- LLM/AI ile kullanım için optimize edilmiştir

**Neden bu Actor?**
- Şirket web sitesinin About, Mission, Careers, Blog sayfalarını tarar
- JavaScript rendered sayfaları destekler
- Markdown çıktısı doğrudan AI'a verilebilir
- Sayfa sayısı sınırlanabilir (maxCrawlPages: 5 → hızlı ve ucuz)

### 3.2 Actor Input Yapısı

```typescript
interface WebsiteContentCrawlerInput {
  startUrls: Array<{ url: string }>;
  maxCrawlPages: number;           // 5 — sadece kritik sayfalar
  maxCrawlDepth: number;           // 1 — sadece 1 seviye derinlik
  crawlerType: string;             // "cheerio" (hızlı) veya "playwright" (JS render)
  excludeUrlGlobs?: string[];      // Atlanacak sayfalar
  includeUrlGlobs?: string[];      // Öncelikli sayfalar
  removeCookieWarnings: boolean;   // true
  clickElementsCssSelector?: string;
  useSitemapUrls: boolean;         // false — sadece belirtilen URL'den başla
}
```

**Gerçek Input Örneği:**

```json
{
  "startUrls": [
    {"url": "https://trendyol.com/about"},
    {"url": "https://trendyol.com/careers"},
    {"url": "https://trendyol.com"}
  ],
  "maxCrawlPages": 5,
  "maxCrawlDepth": 1,
  "crawlerType": "cheerio",
  "removeCookieWarnings": true,
  "useSitemapUrls": false,
  "includeUrlGlobs": [
    "https://trendyol.com/about*",
    "https://trendyol.com/career*",
    "https://trendyol.com/blog*",
    "https://trendyol.com/mission*"
  ]
}
```

**Actor Output (her sayfa için bir item):**

```json
{
  "url": "https://trendyol.com/about",
  "title": "About Us — Trendyol",
  "text": "Trendyol is Turkey's leading e-commerce platform...",
  "markdown": "# About Us\n\nTrendyol is Turkey's leading...",
  "metadata": {
    "description": "Learn about Trendyol's mission and values"
  }
}
```

### 3.3 Şirket URL'si Tespiti

Kullanıcı şirket adı veya URL girebilir. URL girilmezse:

```typescript
// Şirket adından URL tahmini
async function guessCompanyUrl(companyName: string): Promise<string[]> {
  const cleanName = companyName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  // Önce web search ile bul (Apify web-search actor veya Google API)
  // Fallback: yaygın format tahminleri
  const candidates = [
    `https://www.${cleanName}.com`,
    `https://${cleanName}.com`,
    `https://www.${cleanName}.io`,
    `https://${cleanName}.co`,
  ];
  
  // Her adayı HTTP HEAD ile test et, çalışanı döndür
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (res.ok) return [url, `${url}/about`, `${url}/careers`];
    } catch {}
  }
  
  // Hiçbiri çalışmadıysa sadece ilkini dene
  return candidates.slice(0, 3);
}
```

### 3.4 Scrape → Yapılandırılmış Profil Dönüşümü

Ham scrape metni, AI ile `CompanyProfile` objesine dönüştürülür:

```typescript
// lib/company-research.ts

async function convertScrapedDataToProfile(
  scrapedItems: ApifyWebCrawlerItem[],
  companyUrl: string
): Promise<CompanyProfile> {
  
  // Tüm sayfaların metnini birleştir (max 8000 token)
  const combinedText = scrapedItems
    .map(item => `=== ${item.url} ===\n${item.markdown || item.text}`)
    .join('\n\n')
    .substring(0, 20000); // Karakter sınırı
  
  const systemPrompt = `
You are a company research analyst. Extract structured information from the following scraped company website content.

Return ONLY valid JSON matching this exact schema:
{
  "name": "Company name",
  "industry": "Industry/sector",
  "founded": "Year or null",
  "headquartersLocation": "City, Country or null",
  "employeeCount": "e.g. '10,000+' or null",
  "mission": "Company mission statement (max 200 chars) or null",
  "vision": "Company vision or null",
  "values": ["value1", "value2"],
  "products": ["product1", "product2"],
  "recentNews": ["news item 1", "news item 2"],
  "cultureIndicators": ["indicator1", "indicator2"],
  "techStack": ["tech1", "tech2"],
  "painPoints": ["growth area 1", "challenge 1"],
  "competitivePosition": "Market position description or null",
  "keyAchievements": ["achievement 1", "achievement 2"],
  "dataQualityScore": 75
}

If information is not available, use null or empty array [].
dataQualityScore should reflect how much useful information was found (0-100).
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Extract company profile from this website content:\n\n${combinedText}`
      }
    ],
    system: systemPrompt
  });

  const jsonText = response.content[0].type === 'text' 
    ? response.content[0].text 
    : '';
  
  // JSON parse (güvenli)
  try {
    const profile = JSON.parse(jsonText.replace(/```json|```/g, '').trim());
    return {
      ...profile,
      website: companyUrl,
      scrapedPages: scrapedItems.map(i => i.url),
      scrapedAt: new Date().toISOString(),
    };
  } catch {
    // Parse hatası → minimal profil döndür
    return {
      name: extractCompanyNameFromUrl(companyUrl),
      website: companyUrl,
      industry: 'Unknown',
      values: [],
      products: [],
      recentNews: [],
      cultureIndicators: [],
      dataQualityScore: 10,
      scrapedPages: scrapedItems.map(i => i.url),
      scrapedAt: new Date().toISOString(),
    };
  }
}
```

### 3.5 Cache Sistemi

Aynı şirket için 24 saat içinde tekrar araştırma yapılmaz:

```typescript
async function getOrCreateCompanyProfile(
  userId: string,
  companyUrl: string,
  companyName: string
): Promise<CompanyProfile> {
  const domain = extractDomain(companyUrl); // "trendyol.com"
  
  // Cache'de var mı ve süresi dolmamış mı?
  const { data: cached } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('company_domain', domain)
    .eq('scrape_status', 'completed')
    .gt('cache_expires_at', new Date().toISOString())
    .order('scraped_at', { ascending: false })
    .limit(1)
    .single();
  
  if (cached) {
    return cached.structured_profile as CompanyProfile;
  }
  
  // Yeni araştırma başlat
  return await scrapeAndBuildProfile(userId, companyUrl, companyName, domain);
}
```

### 3.6 Tam Apify API Çağrısı — Backend Route

```typescript
// lib/apify-company-scraper.ts

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const WEBSITE_CRAWLER_ACTOR = 'apify~website-content-crawler';

export async function scrapeCompanyWebsite(
  urls: string[]
): Promise<ApifyWebCrawlerItem[]> {
  
  // Actor'ı başlat
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/${WEBSITE_CRAWLER_ACTOR}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startUrls: urls.map(url => ({ url })),
        maxCrawlPages: 5,
        maxCrawlDepth: 1,
        crawlerType: 'cheerio',
        removeCookieWarnings: true,
        useSitemapUrls: false,
      }),
    }
  );
  
  if (!runResponse.ok) {
    throw new Error(`Apify run başlatılamadı: ${runResponse.status}`);
  }
  
  const runData = await runResponse.json();
  const runId = runData.data.id;
  const datasetId = runData.data.defaultDatasetId;
  
  // Polling: SUCCEEDED olana kadar bekle (max 90 saniye)
  let status = 'RUNNING';
  let attempts = 0;
  
  while (['RUNNING', 'READY'].includes(status) && attempts < 30) {
    await sleep(3000);
    attempts++;
    
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    const statusData = await statusRes.json();
    status = statusData.data.status;
    
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
      throw new Error(`Apify scrape başarısız: ${status}`);
    }
  }
  
  if (status !== 'SUCCEEDED') {
    throw new Error('Scrape zaman aşımına uğradı');
  }
  
  // Dataset'i al
  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=10&clean=true`
  );
  
  if (!itemsRes.ok) throw new Error('Dataset alınamadı');
  return await itemsRes.json();
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
```

---

## 4. Adım 2: AI Mektup Üretim Motoru

### 4.1 Üretim Stratejisi

Her motivasyon mektubu şu verileri kullanarak üretilir:
- **CompanyProfile** (araştırma verisi)
- **ResumeJSON** (kullanıcının CV verisi)
- **target_role** (kullanıcının hedeflediği pozisyon)
- **tone** (seçilen ton)

Mektup ASLA şablon doldurmaz. AI, şirket araştırma verisini CV ile eşleştirerek gerçek bağlantılar kurar.

### 4.2 Ton Profilleri

```typescript
const TONE_PROFILES = {
  corporate: {
    label: 'Profesyonel & Kurumsal',
    description: 'Resmi, ölçülü, kurumsal dil. Büyük şirketler, finans, hukuk.',
    keywords: ['strategic', 'deliver', 'implement', 'results-driven', 'align'],
    openingStyle: 'formal',
    signoff: 'Yours sincerely',
  },
  startup: {
    label: 'Startup & İnovasyon Odaklı',
    description: 'Enerjik, yaratıcı, growth-minded dil. Startup\'lar, tech scale-up\'lar.',
    keywords: ['build', 'ship', 'iterate', 'impact', 'move fast', 'mission-driven'],
    openingStyle: 'energetic',
    signoff: 'Excited to connect',
  },
  friendly_formal: {
    label: 'Samimi & Profesyonel',
    description: 'Sıcak ama profesyonel. Orta ölçekli şirketler, kreatif sektörler.',
    keywords: ['collaborate', 'contribute', 'passionate', 'team', 'grow together'],
    openingStyle: 'warm',
    signoff: 'Kind regards',
  },
  executive: {
    label: 'Yönetici Seviyesi',
    description: 'Güçlü liderlik dili. C-level, Director, VP pozisyonları.',
    keywords: ['lead', 'transform', 'vision', 'scale', 'P&L', 'board', 'stakeholder'],
    openingStyle: 'authoritative',
    signoff: 'Best regards',
  },
};
```

### 4.3 AI Sistem Prompt'u

Bu prompt her mektup üretiminde kullanılır. Her değişken runtime'da doldurulur:

```typescript
function buildMotivationLetterSystemPrompt(
  companyProfile: CompanyProfile,
  resumeJSON: ResumeJSON,
  targetRole: string,
  tone: keyof typeof TONE_PROFILES,
  language: 'en' | 'tr' = 'en'
): string {
  
  const toneProfile = TONE_PROFILES[tone];
  
  return `
You are an expert career coach and copywriter who writes highly personalized, research-based motivation letters.

## YOUR TASK
Write a compelling motivation letter for the candidate applying to ${companyProfile.name} for the role of ${targetRole}.

## TONE REQUIREMENTS
Style: ${toneProfile.label}
Description: ${toneProfile.description}
Key vocabulary to use naturally: ${toneProfile.keywords.join(', ')}
Opening style: ${toneProfile.openingStyle}
Sign-off: ${toneProfile.signoff}

## COMPANY INTELLIGENCE (Use this — reference specific details)
Company: ${companyProfile.name}
Industry: ${companyProfile.industry}
Mission: ${companyProfile.mission || 'Not specified'}
Core Values: ${companyProfile.values.join(', ') || 'Not specified'}
Key Products/Services: ${companyProfile.products.join(', ') || 'Not specified'}
Culture Indicators: ${companyProfile.cultureIndicators.join(', ') || 'Not specified'}
Recent Developments: ${companyProfile.recentNews.join(' | ') || 'Not specified'}
Strategic Focus Areas: ${companyProfile.painPoints?.join(', ') || 'Not specified'}

## CANDIDATE PROFILE (From their CV)
Name: ${resumeJSON.header.full_name}
Current/Last Title: ${resumeJSON.header.headline}
Summary: ${resumeJSON.summary || 'Not provided'}
Core Skills: ${resumeJSON.skills?.core?.join(', ') || 'Not specified'}
Technical Tools: ${resumeJSON.skills?.tools?.join(', ') || 'Not specified'}
Most Relevant Experience:
${resumeJSON.experience?.slice(0, 3).map(exp =>
  `- ${exp.role} at ${exp.company} (${exp.start_date} – ${exp.is_current ? 'Present' : exp.end_date})\n  ${exp.bullets.slice(0, 3).join('\n  ')}`
).join('\n\n')}
Most Relevant Projects:
${resumeJSON.projects?.slice(0, 2).map(p =>
  `- ${p.name}: ${p.bullets.slice(0, 2).join('; ')}`
).join('\n') || 'None specified'}

## MANDATORY RULES
1. NEVER use generic phrases like "I am passionate about this role" without specific evidence
2. Reference at least 2 SPECIFIC things from the company research (values, products, news, etc.)
3. Connect the candidate's SPECIFIC achievements/projects to the company's specific needs
4. Use at least 1 quantified result from the candidate's experience
5. Each paragraph must serve a distinct purpose (see structure below)
6. Letter length: 320-400 words MAXIMUM
7. Language: ${language === 'tr' ? 'Write in Turkish' : 'Write in English'}
8. Do NOT include date, address blocks, or "Dear Hiring Manager" — just the body paragraphs

## LETTER STRUCTURE (4 paragraphs, strictly follow this)

PARAGRAPH 1 — Opening Hook (40-60 words)
Why THIS company, right now? Reference something specific — a recent product launch, a mission statement, a culture value. Show you've done real research. Make the hiring manager feel recognized, not like one of a hundred recipients.

PARAGRAPH 2 — Candidate's Strongest Proof Point (80-100 words)
Present the candidate's single most relevant achievement or project. Must include a metric or quantifiable outcome. Connect it explicitly to what the company needs or values.

PARAGRAPH 3 — Skills & Cultural Fit Alignment (80-100 words)
Show 2-3 skill/experience matches with the company's specific context. If the company values agility → show evidence of agile work. If they're data-driven → show data work. If it's a startup → show builder mentality.

PARAGRAPH 4 — Call to Action (40-60 words)
Confident, not desperate. Express genuine excitement with specific reasons. Suggest next step naturally. Match the sign-off to the tone profile.

## OUTPUT FORMAT
Return ONLY the letter body text (no subject line, no headers). 
Plain text, paragraphs separated by double newlines.
`;
}
```

### 4.4 AI Çağrısı — Backend Fonksiyon

```typescript
// lib/letter-generator.ts

import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateMotivationLetter(
  companyProfile: CompanyProfile,
  resumeJSON: ResumeJSON,
  targetRole: string,
  tone: string,
  language: 'en' | 'tr' = 'en'
): Promise<{ letterText: string; letterHtml: string }> {
  
  const systemPrompt = buildMotivationLetterSystemPrompt(
    companyProfile, resumeJSON, targetRole, tone as any, language
  );
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages: [
      {
        role: 'user',
        content: 'Generate the motivation letter following all the rules and structure provided.'
      }
    ],
    system: systemPrompt
  });
  
  const letterText = response.content[0].type === 'text'
    ? response.content[0].text.trim()
    : '';
  
  if (!letterText || letterText.length < 200) {
    throw new Error('Üretilen mektup çok kısa veya boş');
  }
  
  // Düz metin → HTML dönüşümü (PDF için)
  const letterHtml = convertLetterTextToHtml(letterText, companyProfile.name);
  
  return { letterText, letterHtml };
}

function convertLetterTextToHtml(text: string, companyName: string): string {
  // Paragrafları <p> tag'lerine çevir
  const paragraphs = text
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
    .join('\n');
  
  return `
<div class="letter-body">
  ${paragraphs}
</div>
  `.trim();
}
```

### 4.5 Mektup Düzenleme Özelliği

Üretilen mektup, kullanıcı tarafından düzenlenebilir olmalı:

```tsx
// components/LetterEditor.tsx
// Kullanıcı mektubu düzenleyip yeniden PDF oluşturabilir

interface LetterEditorProps {
  initialText: string;
  letterId: string;
  onSave: (newText: string) => void;
  onRegeneratePDF: () => void;
}

// Rich text editor (basit bir contentEditable veya shadcn Textarea)
// "Kaydet" → veritabanını güncelle
// "PDF Oluştur" → güncel metinle yeni PDF üret
```

---

## 5. Adım 3: PDF Oluşturma Motoru

### 5.1 PDF Şablonları

4 farklı şablon desteklenir:

```typescript
interface PDFTemplate {
  id: string;
  name: string;
  isPremium: boolean;
  layout: 'minimal' | 'modern' | 'classic' | 'bold';
  fonts: { heading: string; body: string };
  colors: { primary: string; accent: string; text: string; muted: string };
  headerStyle: 'simple' | 'full' | 'sidebar';
}

const PDF_TEMPLATES: PDFTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    isPremium: false,
    layout: 'minimal',
    fonts: { heading: 'Inter', body: 'Inter' },
    colors: { primary: '#1a1a2e', accent: '#2563eb', text: '#2d2d2d', muted: '#777777' },
    headerStyle: 'simple',
  },
  {
    id: 'modern',
    name: 'Modern Pro',
    isPremium: true,
    layout: 'modern',
    fonts: { heading: 'Playfair Display', body: 'Source Sans Pro' },
    colors: { primary: '#0f172a', accent: '#0ea5e9', text: '#1e293b', muted: '#64748b' },
    headerStyle: 'full',
  },
  {
    id: 'classic',
    name: 'Classic Executive',
    isPremium: true,
    layout: 'classic',
    fonts: { heading: 'Georgia', body: 'Times New Roman' },
    colors: { primary: '#1a1a1a', accent: '#8b0000', text: '#1a1a1a', muted: '#666666' },
    headerStyle: 'simple',
  },
  {
    id: 'bold',
    name: 'Bold Startup',
    isPremium: true,
    layout: 'bold',
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    colors: { primary: '#6d28d9', accent: '#f59e0b', text: '#111827', muted: '#6b7280' },
    headerStyle: 'sidebar',
  },
];
```

### 5.2 PDF HTML Şablonu

Puppeteer'ın render edeceği HTML:

```typescript
function buildPDFHtml(
  letterHtml: string,
  resumeJSON: ResumeJSON,
  companyName: string,
  targetRole: string,
  template: PDFTemplate,
  date: string,
  includePhoto: boolean = false
): string {
  
  const photoSection = includePhoto && resumeJSON.header.photo_url
    ? `<img src="${resumeJSON.header.photo_url}" class="contact-photo" alt="Photo" />`
    : '';
  
  const salary = resumeJSON.header.phone || '';
  const linkedin = resumeJSON.header.linkedin_url
    ? `<span>• ${resumeJSON.header.linkedin_url.replace('https://linkedin.com/in/', 'linkedin.com/in/')}</span>`
    : '';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=${template.fonts.heading.replace(' ', '+')}:wght@400;600;700&family=${template.fonts.body.replace(' ', '+')}:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: '${template.fonts.body}', sans-serif;
      font-size: 11pt;
      line-height: 1.7;
      color: ${template.colors.text};
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 25mm 22mm 20mm 22mm;
      margin: 0 auto;
      background: white;
    }
    
    /* Header */
    .letter-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 16px;
      border-bottom: 2px solid ${template.colors.accent};
      margin-bottom: 28px;
    }
    
    .contact-info h1 {
      font-family: '${template.fonts.heading}', serif;
      font-size: 22pt;
      font-weight: 700;
      color: ${template.colors.primary};
      margin-bottom: 4px;
    }
    
    .contact-info .headline {
      font-size: 10pt;
      color: ${template.colors.muted};
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .contact-details {
      font-size: 9pt;
      color: ${template.colors.muted};
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .contact-photo {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid ${template.colors.accent};
    }
    
    /* Date & Recipient */
    .letter-meta {
      margin-bottom: 24px;
    }
    
    .letter-date {
      font-size: 10pt;
      color: ${template.colors.muted};
      margin-bottom: 12px;
    }
    
    .letter-recipient {
      font-size: 10.5pt;
      font-weight: 600;
      color: ${template.colors.primary};
    }
    
    .letter-subject {
      font-size: 12pt;
      font-weight: 700;
      color: ${template.colors.primary};
      margin: 16px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    /* Mektup gövdesi */
    .letter-body p {
      margin-bottom: 16px;
      text-align: justify;
      font-size: 11pt;
      line-height: 1.75;
    }
    
    .letter-body p:last-child {
      margin-bottom: 0;
    }
    
    /* Footer */
    .letter-footer {
      margin-top: 32px;
    }
    
    .letter-footer .signoff {
      font-size: 11pt;
      margin-bottom: 40px;
    }
    
    .letter-footer .signature-name {
      font-family: '${template.fonts.heading}', serif;
      font-size: 14pt;
      font-weight: 700;
      color: ${template.colors.primary};
    }
    
    /* Accent bar — şablon bazlı */
    ${template.layout === 'bold' ? `
    .accent-bar {
      width: 40px;
      height: 4px;
      background: ${template.colors.accent};
      margin: 12px 0;
    }
    ` : ''}
    
    @page { margin: 0; }
    @media print { body { print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="page">
    
    <!-- Header: Gönderen bilgisi -->
    <div class="letter-header">
      <div class="contact-info">
        <h1>${resumeJSON.header.full_name}</h1>
        <div class="headline">${resumeJSON.header.headline}</div>
        <div class="contact-details">
          <span>${resumeJSON.header.email}</span>
          ${resumeJSON.header.phone ? `<span>• ${resumeJSON.header.phone}</span>` : ''}
          ${resumeJSON.header.location ? `<span>• ${resumeJSON.header.location}</span>` : ''}
          ${linkedin}
        </div>
      </div>
      ${photoSection}
    </div>
    
    <!-- Tarih & Alıcı -->
    <div class="letter-meta">
      <div class="letter-date">${date}</div>
      <div class="letter-recipient">Hiring Team at ${companyName}</div>
    </div>
    
    <!-- Konu -->
    <div class="letter-subject">
      Re: Application for ${targetRole}
    </div>
    
    ${template.layout === 'bold' ? '<div class="accent-bar"></div>' : ''}
    
    <!-- Mektup gövdesi (AI üretimi) -->
    ${letterHtml}
    
    <!-- Kapanış -->
    <div class="letter-footer">
      <div class="signoff">Sincerely,</div>
      <div class="signature-name">${resumeJSON.header.full_name}</div>
    </div>
    
  </div>
</body>
</html>
  `.trim();
}
```

### 5.3 Puppeteer ile PDF Oluşturma

```typescript
// lib/pdf-generator.ts
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

export async function generateLetterPDF(
  letterHtml: string,
  resumeJSON: ResumeJSON,
  companyName: string,
  targetRole: string,
  templateId: string,
  userId: string,
  letterId: string
): Promise<{ pdfUrl: string; pdfStoragePath: string }> {
  
  const template = PDF_TEMPLATES.find(t => t.id === templateId) ?? PDF_TEMPLATES[0];
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }); // "15 January 2025"
  
  // HTML şablonunu oluştur
  const fullHtml = buildPDFHtml(
    letterHtml, resumeJSON, companyName, targetRole, template, date
  );
  
  // Puppeteer ile PDF üret
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  
  try {
    const page = await browser.newPage();
    
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0', // Google Fonts yüklensin
    });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    
    // Dosya adı
    const safeName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Motivation_Letter_${safeName}.pdf`;
    const storagePath = `motivation-letters/${userId}/${letterId}/${filename}`;
    
    // Supabase Storage'a yükle
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });
    
    if (uploadError) throw new Error(`PDF yükleme hatası: ${uploadError.message}`);
    
    // Signed URL (1 yıl geçerli)
    const { data: urlData } = await supabase.storage
      .from('user-files')
      .createSignedUrl(storagePath, 365 * 24 * 60 * 60);
    
    return {
      pdfUrl: urlData?.signedUrl ?? '',
      pdfStoragePath: storagePath,
    };
    
  } finally {
    await browser.close();
  }
}
```

---

## 6. Adım 4: "Motivasyon Mektuplarım" Dashboard Sayfası

### 6.1 Sayfa Layoutu

```
┌─────────────────────────────────────────────────────────────────────┐
│ NAVBAR: [CV'lerim] [İş Ara] [Motivasyon Mektupları ✨] [Ayarlar]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Motivasyon Mektuplarım                    [+ Yeni Mektup Oluştur] │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🔍 Şirket adına göre ara...   📅 Tarih ▼   📥 Toplu İndir  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ □ | 🏢 Trendyol | Sr. PM | 15 Oca 2025 | ✅ Hazır          │   │
│  │   | [Önizle] [İndir PDF] [Paylaş] [Sil]                    │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ □ | 🏢 Getir    | PM     | 14 Oca 2025 | ✅ Hazır          │   │
│  │   | [Önizle] [İndir PDF] [Paylaş] [Sil]                    │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ □ | 🏢 Hepsiburada | PM  | ⏳ Oluşturuluyor...             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Tablo Satırı Bileşeni

Her mektup için bir satır:

```tsx
// components/MotivationLetterRow.tsx

interface LetterRowProps {
  letter: MotivationLetter;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPreview: (letter: MotivationLetter) => void;
  onShare: (letter: MotivationLetter) => void;
  onDelete: (id: string) => void;
  isPro: boolean;
}

// Durum göstergesi
function StatusBadge({ status }: { status: string }) {
  const configs = {
    pending: { label: 'Bekliyor', color: 'gray', icon: '⏸' },
    researching: { label: 'Araştırılıyor...', color: 'blue', icon: '🔍' },
    generating: { label: 'Yazılıyor...', color: 'blue', icon: '✍️' },
    creating_pdf: { label: 'PDF Oluşturuluyor...', color: 'blue', icon: '📄' },
    completed: { label: 'Hazır', color: 'green', icon: '✅' },
    failed: { label: 'Hata', color: 'red', icon: '❌' },
  };
  const config = configs[status] || configs.pending;
  return (
    <span className={`badge badge-${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}
```

### 6.3 Önizleme Modal'ı

Mektuba tıklanınca açılan tam sayfa modal:

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Geri   Trendyol — Senior Product Manager                     │
│                                                                  │
│  [PDF Önizleme — iframe veya rendered HTML]                      │
│                                                                  │
│  ─────────────────────────────────────────────────────           │
│  Şablon: [Minimal ▼]   Ton: [Startup ▼]   [Yeniden Üret]        │
│                                                                  │
│  [İndir PDF]   [Paylaşım Linki Kopyala]   [Düzenle]             │
└──────────────────────────────────────────────────────────────────┘
```

### 6.4 Toplu İndirme

Seçili mektupları ZIP olarak indir:

```typescript
// app/api/motivation-letters/batch-download/route.ts
import JSZip from 'jszip';

export async function POST(request: Request) {
  const { letterIds } = await request.json();
  
  const zip = new JSZip();
  
  for (const id of letterIds) {
    const letter = await getLetterWithPDF(id);
    if (letter.pdf_url) {
      const pdfBuffer = await fetch(letter.pdf_url).then(r => r.arrayBuffer());
      zip.file(letter.pdf_filename, pdfBuffer);
    }
  }
  
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  
  return new Response(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="motivation-letters.zip"',
    },
  });
}
```

### 6.5 Arama & Filtreleme

```typescript
// Anlık arama (debounce: 300ms)
const [search, setSearch] = useState('');
const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

const filteredLetters = useMemo(() => {
  return letters
    .filter(l => !search || l.company_name.toLowerCase().includes(search.toLowerCase()))
    .filter(l => {
      if (dateFilter === 'all') return true;
      const date = new Date(l.created_at);
      const now = new Date();
      if (dateFilter === 'today') return isSameDay(date, now);
      if (dateFilter === 'week') return isWithinInterval(date, { start: subDays(now, 7), end: now });
      if (dateFilter === 'month') return isWithinInterval(date, { start: subDays(now, 30), end: now });
      return true;
    });
}, [letters, search, dateFilter]);
```

---

## 7. Tam UX Akışı — Ekran Ekran

### 7.1 "Yeni Mektup Oluştur" Akışı

```
ADIM 1 — Şirket Ekle Ekranı
────────────────────────────
Başlık: "Hangi şirket(ler) için mektup oluşturulsun?"

Giriş yöntemi seçimi:
  [🔗 URL ile Ekle]  [🔍 Adla Ara]  [📋 Job İlanından Doldur]

URL ile ekle:
  Input: https://trendyol.com
  [+ Başka Şirket Ekle] (Pro: batch, Free: 1 şirket)
  
Eklenen şirketler:
  [🏢 trendyol.com ×]  [🏢 getir.com ×]

Alt bölüm: "CV seç"
  Dropdown: [CV'lerini seç ▼] → kullanıcının mevcut CV'leri listelenir

[İleri →]

─────────────────────────────────────────────────────
ADIM 2 — Pozisyon & Ton Seçimi
──────────────────────────────────────────────────────
"Her şirket için hedef pozisyon ve mektup tonunu belirt"

Her şirket kartı:
┌────────────────────────────────────────────────┐
│ 🏢 Trendyol                                    │
│ Hedef Pozisyon: [Senior Product Manager      ] │
│ Ton: [Startup & İnovasyon Odaklı           ▼] │
│ Dil: [English ▼]                              │
└────────────────────────────────────────────────┘

Pro kullanıcı → Toplu ton seçimi: "Tüm şirketlere uygula"

[← Geri]  [✨ Oluştur]

─────────────────────────────────────────────────────
ADIM 3 — Oluşturma Ekranı (Progress Tracker)
──────────────────────────────────────────────────────
"Mektuplar hazırlanıyor..."

Her şirket için ayrı progress bar:

🏢 Trendyol:
  [████████░░] 80%  "Mektup yazılıyor..."

🏢 Getir:
  [██░░░░░░░░] 20%  "Web sitesi araştırılıyor..."

Tamamlandıkça:
  ✅ Trendyol — Hazır! [Önizle]
  ⏳ Getir — PDF oluşturuluyor...

[Tamamlandığında Dashboard'a Git →]

─────────────────────────────────────────────────────
ADIM 4 — Dashboard (Motivasyon Mektuplarım)
──────────────────────────────────────────────────────
[Yukarıdaki 6.1 bölümünde tanımlı dashboard]
```

### 7.2 Mektup Oluşturma İçin Wizard Bileşeni

```tsx
// components/LetterCreationWizard.tsx
type WizardStep = 'companies' | 'config' | 'generating' | 'done';

interface WizardState {
  step: WizardStep;
  companies: CompanyInput[];        // URL + isim
  selectedCvId: string;
  jobConfigs: JobConfig[];          // Her şirket için pozisyon + ton
  progress: Record<string, LetterProgress>;
  completedIds: string[];
}

interface CompanyInput {
  id: string;          // Geçici client ID
  url: string;
  name?: string;       // URL'den tahmin edilecek
}

interface JobConfig {
  companyId: string;
  targetRole: string;
  tone: ToneType;
  language: 'en' | 'tr';
}

interface LetterProgress {
  companyName: string;
  status: GenerationStatus;
  message: string;
  percentage: number;
  letterId?: string;
}
```

---

## 8. API Route Katmanı — Tüm Endpoint'ler

### 8.1 Endpoint Listesi

```
POST /api/motivation-letters/create              → Mektup oluşturma başlat (wizard step 2)
GET  /api/motivation-letters                     → Kullanıcının tüm mektupları
GET  /api/motivation-letters/[id]                → Tek mektup detayı
PUT  /api/motivation-letters/[id]                → Mektup güncelle (text düzenleme)
DEL  /api/motivation-letters/[id]                → Mektup sil (Storage'dan da)
GET  /api/motivation-letters/[id]/download       → PDF stream
POST /api/motivation-letters/[id]/share          → Paylaşım linki oluştur/güncelle
POST /api/motivation-letters/[id]/regenerate-pdf → Güncel text ile PDF yeniden oluştur
POST /api/motivation-letters/batch-download      → Seçili mektupları ZIP
GET  /api/motivation-letters/share/[token]       → Public share endpoint (auth gerektirmez)
POST /api/company-research                       → Şirket araştır (Apify)
GET  /api/company-research/[id]/status           → Araştırma durumu polling
```

### 8.2 Ana Oluşturma Endpoint'i

```typescript
// app/api/motivation-letters/create/route.ts

export async function POST(request: Request) {
  const { user, isPro } = await requireAuth(request);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await request.json();
  const { companies, cvId, jobConfigs } = body;
  
  // Free kullanıcı: max 1 mektup/ay kontrolü
  if (!isPro) {
    const monthlyCount = await getMonthlyLetterCount(user.id);
    if (monthlyCount >= FREE_LETTER_LIMIT) {
      return Response.json(
        { error: 'upgrade_required', message: `Aylık ${FREE_LETTER_LIMIT} mektup limitine ulaştınız` },
        { status: 403 }
      );
    }
    // Free: sadece 1 şirket
    if (companies.length > 1) {
      return Response.json(
        { error: 'upgrade_required', message: 'Toplu oluşturma Pro özelliği' },
        { status: 403 }
      );
    }
  }
  
  // CV'yi al
  const cv = await getCVById(cvId, user.id);
  if (!cv) return Response.json({ error: 'CV bulunamadı' }, { status: 404 });
  
  // Batch ID oluştur
  const batchId = crypto.randomUUID();
  
  // Her şirket için placeholder kayıt oluştur ve arka planda işlemi başlat
  const letterIds = await Promise.all(
    companies.map(async (company, i) => {
      const config = jobConfigs[i];
      
      // Veritabanına pending kayıt ekle
      const { data: letter } = await supabase
        .from('motivation_letters')
        .insert({
          user_id: user.id,
          cv_id: cvId,
          company_name: company.name || extractCompanyName(company.url),
          target_role: config.targetRole,
          tone: config.tone,
          letter_text: '',
          letter_html: '',
          generation_status: 'pending',
          batch_id: batchId,
        })
        .select()
        .single();
      
      // Arka planda işlemi başlat (await etme — non-blocking)
      processLetterGeneration(letter.id, company, config, cv.resume_json, user.id);
      
      return letter.id;
    })
  );
  
  return Response.json({ letterIds, batchId });
}

// Arka plan işlemi
async function processLetterGeneration(
  letterId: string,
  company: CompanyInput,
  config: JobConfig,
  resumeJSON: ResumeJSON,
  userId: string
) {
  try {
    // 1. Araştırma
    await updateLetterStatus(letterId, 'researching', 'Web sitesi araştırılıyor...');
    const companyProfile = await getOrCreateCompanyProfile(userId, company.url, company.name);
    
    // 2. Mektup üretimi
    await updateLetterStatus(letterId, 'generating', 'Mektup yazılıyor...');
    const { letterText, letterHtml } = await generateMotivationLetter(
      companyProfile, resumeJSON, config.targetRole, config.tone, config.language
    );
    
    // 3. PDF oluşturma
    await updateLetterStatus(letterId, 'creating_pdf', 'PDF oluşturuluyor...');
    const { pdfUrl, pdfStoragePath } = await generateLetterPDF(
      letterHtml, resumeJSON, company.name, config.targetRole,
      'modern', userId, letterId
    );
    
    // 4. Share token üret
    const shareToken = crypto.randomUUID();
    const shareExpiry = (await isProUser(userId)) ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // 5. Tamamla
    await supabase.from('motivation_letters').update({
      letter_text: letterText,
      letter_html: letterHtml,
      pdf_url: pdfUrl,
      pdf_storage_path: pdfStoragePath,
      pdf_filename: `Motivation_Letter_${company.name.replace(/\s+/g, '_')}.pdf`,
      pdf_generated_at: new Date().toISOString(),
      share_token: shareToken,
      share_expires_at: shareExpiry,
      generation_status: 'completed',
    }).eq('id', letterId);
    
  } catch (error) {
    await supabase.from('motivation_letters').update({
      generation_status: 'failed',
      generation_error: error.message,
    }).eq('id', letterId);
  }
}
```

### 8.3 Gerçek Zamanlı Durum Takibi

Frontend, Supabase Realtime ile mektup durumunu anlık takip eder:

```typescript
// hooks/useLetterProgress.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useLetterProgress(letterIds: string[]) {
  const [progress, setProgress] = useState<Record<string, MotivationLetter>>({});
  
  useEffect(() => {
    if (!letterIds.length) return;
    
    // Realtime subscription
    const channel = supabase
      .channel('letter-progress')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'motivation_letters',
          filter: `id=in.(${letterIds.join(',')})`,
        },
        (payload) => {
          setProgress(prev => ({
            ...prev,
            [payload.new.id]: payload.new as MotivationLetter,
          }));
        }
      )
      .subscribe();
    
    // İlk veriyi de al
    supabase
      .from('motivation_letters')
      .select('*')
      .in('id', letterIds)
      .then(({ data }) => {
        if (data) {
          const map = Object.fromEntries(data.map(l => [l.id, l]));
          setProgress(map);
        }
      });
    
    return () => { supabase.removeChannel(channel); };
  }, [letterIds.join(',')]);
  
  return progress;
}
```

### 8.4 Public Share Endpoint'i

```typescript
// app/api/motivation-letters/share/[token]/route.ts — Auth gerektirmez

export async function GET(request: Request, { params }) {
  const { data: letter } = await supabase
    .from('motivation_letters')
    .select('*')
    .eq('share_token', params.token)
    .eq('is_public', true)
    .single();
  
  if (!letter) {
    return Response.json({ error: 'Link geçersiz veya süresi dolmuş' }, { status: 404 });
  }
  
  if (letter.share_expires_at && new Date(letter.share_expires_at) < new Date()) {
    return Response.json({ error: 'Paylaşım linki süresi doldu' }, { status: 410 });
  }
  
  // Sadece güvenli alanları döndür (tam CV verisi değil)
  return Response.json({
    company_name: letter.company_name,
    target_role: letter.target_role,
    pdf_url: letter.pdf_url,
    created_at: letter.created_at,
  });
}
```

---

## 9. Pro Plan & Monetizasyon Sistemi

### 9.1 Feature Gating Tablosu

| Özellik | Free | Pro |
|---|---|---|
| Aylık mektup sayısı | 3 | Sınırsız |
| Aynı anda şirket sayısı | 1 | 10 |
| PDF şablonları | 1 (Minimal) | 4 (hepsi) |
| Şirket araştırma derinliği | 3 sayfa | 5 sayfa (daha zengin veri) |
| Ton seçimi | 1 (Corporate) | 4 ton |
| Paylaşılabilir link | 7 günlük | Süresiz |
| Mektup düzenleme | ❌ | ✅ |
| Toplu indirme (ZIP) | ❌ | ✅ |
| Yeniden üretme | ❌ | ✅ |
| Fotoğraflı PDF header | ❌ | ✅ |

### 9.2 Free Limit Kontrolü

```typescript
const FREE_LETTER_LIMIT = 3; // Ayda 3 mektup

async function getMonthlyLetterCount(userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { count } = await supabase
    .from('motivation_letters')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());
  
  return count ?? 0;
}
```

### 9.3 Monetizasyon Psikolojisi — Neden Kullanıcılar Öder

**1. Emek Yatırımı (Sunk Cost Psychology):**
Kullanıcı 1 mektup oluşturursa, 3'ünü görmek ister. 3'ünü görünce, "10 şirket için aynı anda yapsam" düşüncesi gelir. Sınıra çarpması, pro'ya geçişi en güçlü tetikleyicidir.

**2. Zaman Değeri (Time = Money):**
Manuel motivasyon mektubu yazmak 2-4 saat sürer. Bu sistem, araştırma + yazma + PDF'i 90 saniyede yapar. Ayda 10 başvuru yapan biri için aylık ~30 saat tasarruf = açıkça para değerinde.

**3. Kaybetme Korkusu (Loss Aversion):**
Paylaşılabilir linkler Free'de 7 günde sona erer. Recruiter linki tıklayana kadar link bozulabilir. Bu somut bir kayıp hissi yaratır.

**4. Kalite Farkı (Quality Gap):**
Free'de sadece Minimal şablon var. Pro şablonlar, özellikle executive ve bold, görsel olarak çok daha etkileyici. Kullanıcı farkı kendi gözüyle görür.

### 9.4 Upgrade Trigger'ları

```typescript
// Upgrade modalı aç — hangi triggerdan açıldığına göre farklı mesaj göster
const UPGRADE_TRIGGERS = {
  monthly_limit: {
    title: 'Aylık limitinize ulaştınız',
    highlight: 'Bu ay 3 mektubunuzu kullandınız',
    cta: 'Pro\'ya geçin ve sınırsız mektup oluşturun',
  },
  batch_companies: {
    title: 'Toplu oluşturma Pro özelliği',
    highlight: '10 şirket için aynı anda mektup oluşturun',
    cta: 'Pro ile 30 dakika yerine 90 saniye harcayın',
  },
  premium_template: {
    title: 'Bu şablon Pro kullanıcılara özel',
    highlight: 'Executive ve Bold şablonlar Pro planında',
    cta: 'Recruiter\'ları etkileyen PDF\'ler için yükseltin',
  },
  edit_letter: {
    title: 'Mektup düzenleme Pro özelliği',
    highlight: 'Üretilen mektupları dilediğiniz gibi değiştirin',
    cta: 'Pro\'ya geçin ve tam kontrol kazanın',
  },
  share_expired: {
    title: 'Paylaşım linkiniz süresi doldu',
    highlight: 'Pro kullanıcılar süresiz link alır',
    cta: 'Pro\'ya geçin ve linkinizi canlı tutun',
  },
};
```

### 9.5 Rekabet Avantajı Analizi

**Bu sistem neden diğer "kapak mektubu üreticileri"nden üstündür:**

| Özellik | Cover Letter Generators (Zety, Resume.io, vs.) | Bu Sistem |
|---|---|---|
| Şirket araştırması | ❌ Yok | ✅ Otomatik Apify ile |
| Kişiselleştirme | ❌ Şablon doldurma | ✅ Gerçek araştırmaya dayalı |
| Şirket referansları | ❌ Yok | ✅ Misyon, değer, ürün referansları |
| PDF kalitesi | ⚠️ Basit | ✅ Profesyonel çok şablonlu |
| Toplu üretim | ❌ Yok | ✅ 10 şirket aynı anda |
| Paylaşılabilir link | ❌ Yok | ✅ Recruiter'a doğrudan gönderilebilir |
| CV entegrasyonu | ⚠️ Manuel giriş | ✅ Mevcut CV'den otomatik çekme |
| Güncelleme | ❌ Statik | ✅ Düzenleme ve yeniden üretme |

---

## 10. Hata Yönetimi & Edge Cases

### 10.1 Apify Scrape Hataları

```typescript
// Scrape başarısız olursa → minimal profil ile devam et
async function scrapeWithFallback(url: string): Promise<CompanyProfile> {
  try {
    const items = await scrapeCompanyWebsite([url]);
    return await convertScrapedDataToProfile(items, url);
  } catch (scrapeError) {
    console.warn('Apify scrape başarısız, AI web search ile fallback deneniyor:', scrapeError);
    
    // Fallback: AI web search ile şirket profili oluştur
    return await buildProfileFromWebSearch(extractCompanyName(url));
  }
}

// Web search fallback (Apify web-search actor)
async function buildProfileFromWebSearch(companyName: string): Promise<CompanyProfile> {
  // Apify'nin arama actorını kullan veya minimal profil döndür
  return {
    name: companyName,
    website: '',
    industry: 'Unknown',
    values: [],
    products: [],
    recentNews: [],
    cultureIndicators: [],
    dataQualityScore: 20, // Düşük kalite skoru
    scrapedPages: [],
    scrapedAt: new Date().toISOString(),
  };
}
```

### 10.2 AI Üretim Hataları

```typescript
// Claude API hata durumunda OpenAI'a fallback
async function generateWithFallback(
  companyProfile: CompanyProfile,
  resumeJSON: ResumeJSON,
  targetRole: string,
  tone: string
): Promise<{ letterText: string; letterHtml: string }> {
  try {
    return await generateMotivationLetter(companyProfile, resumeJSON, targetRole, tone);
  } catch (claudeError) {
    console.warn('Claude API başarısız, OpenAI fallback deneniyor');
    return await generateWithOpenAI(companyProfile, resumeJSON, targetRole, tone);
  }
}
```

### 10.3 PDF Oluşturma Hataları

```typescript
// Puppeteer başarısız → pdf-lib ile basit fallback PDF
async function generatePDFWithFallback(
  letterText: string,
  companyName: string
): Promise<Buffer> {
  try {
    return await generateWithPuppeteer(/* ... */);
  } catch {
    return await generateSimplePDF(letterText, companyName);
  }
}
```

### 10.4 Edge Cases Listesi

- **Çalışmayan URL:** URL erişilemezse → şirket adından web search ile profile oluştur
- **Çok kısa web içeriği:** Sadece 1 sayfa scrape edildi → `dataQualityScore` < 30, kullanıcıya uyarı göster: "Şirket hakkında sınırlı bilgi bulundu. Mektup daha genel olabilir."
- **CV boş:** Özet/deneyim eksikse → AI'a "candidate profile is limited, focus on enthusiasm and potential" ek talimatı ver
- **Aynı şirket iki kez:** Batch'te aynı URL iki kez girilirse → hata göster: "Bu şirket zaten listede"
- **PDF çok büyük:** 5MB üzeri → Puppeteer'da image quality düşür
- **Supabase storage hata:** Upload başarısız → lokal geçici URL ile devam et, yeniden deneme kuyruğuna ekle
- **Realtime bağlantı kopması:** Polling fallback (her 5s GET /api/motivation-letters/[id])

---

## 11. Environment Variables & Güvenlik

### 11.1 Gerekli Env Variables

```bash
# .env.local

# Apify
APIFY_API_TOKEN=apify_api_xxxxxxxxxxxxxxxxxxxxxxxx

# AI
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx         # Fallback için

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxx               # Server-side only

# Storage bucket adı
SUPABASE_STORAGE_BUCKET=user-files

# App
NEXT_PUBLIC_APP_URL=https://app.domain.com
```

### 11.2 Supabase Storage Policy

```sql
-- user-files bucket'ı için RLS
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-files' AND
    (storage.foldername(name))[1] = 'motivation-letters' AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-files' AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-files' AND
    (storage.foldername(name))[2] = auth.uid()::text
  );
```

### 11.3 Rate Limiting

```typescript
// Kullanıcı başına:
const RATE_LIMITS = {
  letterCreation: { max: 10, window: '1h' },   // Saatte max 10 oluşturma isteği
  companyResearch: { max: 20, window: '1h' },  // Saatte max 20 araştırma
  pdfGeneration: { max: 15, window: '1h' },    // Saatte max 15 PDF
};
```

---

## 12. Uygulama Sırası — Adım Adım Checklist

### Faz 1 — Veritabanı & Altyapı
- [ ] Supabase'de `company_profiles` tablosunu oluştur (SQL yukarıda)
- [ ] Supabase'de `motivation_letters` tablosunu oluştur (SQL yukarıda)
- [ ] RLS politikalarını uygula
- [ ] Supabase Storage'da `user-files` bucket'ı oluştur ve storage policies'i ayarla
- [ ] Supabase Realtime'ı `motivation_letters` tablosu için etkinleştir
- [ ] `APIFY_API_TOKEN`, `ANTHROPIC_API_KEY` env variable'larını ekle

### Faz 2 — Apify Şirket Araştırma Modülü
- [ ] `lib/apify-company-scraper.ts` dosyasını oluştur (`scrapeCompanyWebsite` fonksiyonu)
- [ ] `lib/company-research.ts` dosyasını oluştur (`convertScrapedDataToProfile` + Claude entegrasyonu)
- [ ] `getOrCreateCompanyProfile` cache mantığını yaz
- [ ] `guessCompanyUrl` URL tahmini fonksiyonunu yaz
- [ ] `/api/company-research` API route'unu oluştur
- [ ] Apify run → polling → dataset alma akışını test et (curl ile)

### Faz 3 — AI Mektup Üretim Modülü
- [ ] Ton profillerini (`TONE_PROFILES`) tanımla
- [ ] `buildMotivationLetterSystemPrompt` fonksiyonunu yaz
- [ ] `lib/letter-generator.ts` dosyasını oluştur
- [ ] `convertLetterTextToHtml` fonksiyonunu yaz
- [ ] OpenAI fallback'i ekle
- [ ] Farklı ton ve profil kombinasyonlarıyla test et

### Faz 4 — PDF Oluşturma Modülü
- [ ] Puppeteer'ı projeye ekle (`npm install puppeteer`)
- [ ] 4 PDF şablonu JSON'ını tanımla
- [ ] `buildPDFHtml` HTML şablon fonksiyonunu yaz
- [ ] `lib/pdf-generator.ts` dosyasını oluştur
- [ ] Supabase Storage yükleme kodunu yaz
- [ ] Signed URL oluşturmayı test et
- [ ] PDF watermark sistemi (Free kullanıcı için) ekle

### Faz 5 — API Route'ları
- [ ] `/api/motivation-letters/create` — ana oluşturma route'u (background processing)
- [ ] `processLetterGeneration` arka plan fonksiyonu
- [ ] `updateLetterStatus` helper
- [ ] GET `/api/motivation-letters` — liste
- [ ] GET/PUT/DELETE `/api/motivation-letters/[id]`
- [ ] POST `/api/motivation-letters/[id]/share` — paylaşım linki
- [ ] POST `/api/motivation-letters/[id]/regenerate-pdf`
- [ ] POST `/api/motivation-letters/batch-download` — ZIP
- [ ] GET `/api/motivation-letters/share/[token]` — public endpoint

### Faz 6 — Wizard UI
- [ ] `components/LetterCreationWizard.tsx` bileşenini oluştur
- [ ] Adım 1: Şirket ekleme formu (URL input + batch desteği)
- [ ] Adım 2: Her şirket için pozisyon + ton konfigürasyonu
- [ ] Adım 3: Progress tracker (Supabase Realtime ile)
- [ ] `useLetterProgress` hook'unu yaz (Realtime subscription)
- [ ] Free kullanıcı için batch kısıtlama ve upgrade modal entegrasyonu

### Faz 7 — Dashboard Sayfası
- [ ] `app/(dashboard)/motivation-letters/page.tsx` oluştur
- [ ] Mektup listesi tablo bileşeni
- [ ] `StatusBadge` bileşeni
- [ ] Arama + tarih filtresi
- [ ] Checkbox seçim + toplu işlemler
- [ ] Önizleme modal'ı (PDF iframe + letter HTML)
- [ ] Paylaşım linki modal'ı
- [ ] Toplu indirme UI
- [ ] Boş durum (henüz mektup yok)

### Faz 8 — Monetizasyon & Gating
- [ ] Feature gating kontrolleri tüm Pro API route'larına ekle
- [ ] Aylık limit sayacı
- [ ] Upgrade modal'ı (trigger bazlı mesajlar ile)
- [ ] PDF'e watermark (Free) ekleme
- [ ] Share link expiry (Free: 7 gün) otomasyonu
- [ ] Pricing sayfasına "Motivasyon Mektubu" özelliklerini ekle

### Faz 9 — Cila & Test
- [ ] Tüm hata senaryolarını test et (Apify başarısız, AI başarısız, PDF başarısız)
- [ ] Realtime durum takibinin mobilde de çalıştığını test et
- [ ] Batch 5+ şirket oluşturma testi
- [ ] PDF şablon görsel testi (tüm 4 şablon)
- [ ] Share link public sayfası testi
- [ ] ZIP indirme testi (5+ PDF)
- [ ] Mobil responsive kontrolü

---

*Doküman Sonu — Motivasyon Mektubu Modülü v1.0*
*Antigravity AI Build Sistemi için hazırlanmıştır.*
*Apify Actor: apify/website-content-crawler | AI: Claude claude-sonnet-4-6 | PDF: Puppeteer*
