# 🚀 Interview-Ready CV — Claude Code Master Build Prompt

> **Kullanım:** Bu dosyayı Claude Code'a ver ve "Bu dosyayı oku ve Phase 1'den başlayarak projeyi sıfırdan inşa et." de.

---

## 🎯 PROJE TANIMI

**Interview-Ready CV** — LinkedIn profillerini ATS-optimize edilmiş özgeçmişlere dönüştüren, süreli public linkler üreten bir SaaS uygulaması.

Sen (Claude Code) baş mühendissin. Tüm kodu yaz, dosya yapısını oluştur ve her adımı açıkla.

---

## 🛠 TECH STACK (DEĞİŞTİRME)

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Auth & DB | Supabase (Auth + PostgreSQL + RLS) |
| Stil | Tailwind CSS + Shadcn UI |
| AI | OpenAI GPT-4o API |
| Ödeme | Stripe (Yıllık Abonelik) |
| PDF | @react-pdf/renderer |

---

## 📁 KLASÖR YAPISI

Projeyi başlatırken bu yapıyı oluştur:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── import/
│   │   └── resumes/
│   ├── r/[slug]/          ← Public resume view
│   ├── upgrade/
│   └── api/
│       ├── ai/
│       │   ├── parse-linkedin/
│       │   └── optimize-resume/
│       └── stripe/
│           ├── webhook/
│           └── checkout/
├── components/
│   └── resume/
├── lib/
│   └── supabase/
└── types/
```

---

## 🗄 VERİTABANI ŞEMASI (Supabase)

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES tablosu
create table public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  headline text,
  raw_json jsonb not null,
  created_at timestamptz default now()
);

-- RESUMES tablosu
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  optimized_json jsonb not null,
  public_link_slug text unique not null,
  job_title text,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- SUBSCRIPTIONS tablosu
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id text unique,
  status text check (status in ('active', 'trialing', 'expired', 'canceled')) default 'trialing',
  trial_end timestamptz default (now() + interval '7 days'),
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.subscriptions enable row level security;

-- Policies
create policy "Users can CRUD own profiles"
  on public.profiles for all using (auth.uid() = user_id);

create policy "Users can CRUD own resumes"
  on public.resumes for all using (auth.uid() = user_id);

create policy "Users can read own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

create policy "Anyone can read active resumes by slug"
  on public.resumes for select using (is_active = true);

-- Yeni kullanıcı kayıt olunca otomatik subscription oluştur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.subscriptions (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🔑 ENVIRONMENT VARIABLES

Proje kökünde `.env.local` dosyası oluştur:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=KULLANICIDAN_AL
NEXT_PUBLIC_SUPABASE_ANON_KEY=KULLANICIDAN_AL
SUPABASE_SERVICE_ROLE_KEY=KULLANICIDAN_AL

# OpenAI
OPENAI_API_KEY=KULLANICIDAN_AL

# Stripe
STRIPE_SECRET_KEY=KULLANICIDAN_AL
STRIPE_WEBHOOK_SECRET=KULLANICIDAN_AL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=KULLANICIDAN_AL
NEXT_PUBLIC_STRIPE_PRICE_ID=KULLANICIDAN_AL

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **NOT:** Bu değerleri kullanıcıdan iste. Hazır olana kadar placeholder bırak.

---

## 📋 TYPESCRIPT TİPLERİ

`src/types/index.ts` dosyasını oluştur:

```typescript
export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  raw_json: ResumeData;
  created_at: string;
}

export interface ResumeData {
  name: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  gpa?: string;
}

export interface Resume {
  id: string;
  user_id: string;
  profile_id: string;
  optimized_json: ResumeData;
  public_link_slug: string;
  expires_at: string | null;
  is_active: boolean;
  job_title?: string;
  created_at: string;
}

export interface Subscription {
  user_id: string;
  stripe_customer_id: string;
  status: 'active' | 'trialing' | 'expired' | 'canceled';
  trial_end: string | null;
}
```

---

## 🏗 BUILD PLANI — 5 PHASE (SIRASINI KORUYARAK İLERLE)

---

### PHASE 1 — Ortam Kurulumu

**Hedef:** Çalışan bir Next.js iskeleti + Auth.

#### Komutlar (sırayla çalıştır):

```bash
npx create-next-app@latest interview-ready-cv --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd interview-ready-cv

npm install @supabase/supabase-js @supabase/ssr openai stripe @stripe/stripe-js @react-pdf/renderer lucide-react class-variance-authority clsx tailwind-merge nanoid

npx shadcn@latest init
# Seçimler: Default style | Slate color | Yes for CSS variables

npx shadcn@latest add button card input label textarea badge separator skeleton dialog toast
```

#### Oluşturulacak dosyalar:

**`src/lib/supabase/client.ts`**
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**`src/lib/supabase/server.ts`**
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

**`src/lib/supabase/middleware.ts`**
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const protectedPaths = ['/dashboard', '/import', '/resumes'];
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**`src/middleware.ts`**
```typescript
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

**`src/lib/utils.ts`**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(): string {
  return nanoid(10);
}

export function formatDate(dateString: string): string {
  if (!dateString || dateString.toLowerCase() === 'present') return 'Present';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
```

**Login & Signup sayfaları:** Email/password + Google OAuth ile çalışan temiz, minimal Shadcn UI formları oluştur.

**Phase 1 tamamlanınca:** `npm run dev` çalışmalı, `/login` ve `/signup` sayfaları görünmeli.

---

### PHASE 2 — LinkedIn Import + AI Parser

**Hedef:** Kullanıcı LinkedIn metnini yapıştırır → GPT-4o JSON'a dönüştürür → Supabase'e kaydeder.

#### `/import` Sayfası:
- Büyük bir `<textarea>` — "LinkedIn profilinizdeki tüm metni buraya yapıştırın"
- "Import & Parse" butonu
- Loading state: "AI profilinizi analiz ediyor..."
- Başarılı olunca → Dashboard'a yönlendir

#### API Route — `src/app/api/ai/parse-linkedin/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PARSE_PROMPT = `You are a resume parser. Extract information from the LinkedIn profile text below and return ONLY a valid JSON object with this exact structure:
{
  "name": "Full Name",
  "headline": "Professional headline",
  "email": "email if found",
  "phone": "phone if found", 
  "location": "City, Country",
  "summary": "About section text",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM or Present",
      "bullets": ["Achievement or responsibility 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "year": "YYYY",
      "gpa": "GPA if mentioned"
    }
  ],
  "skills": ["Skill 1", "Skill 2"]
}

STRICT RULES:
- Return ONLY the JSON, no explanation
- Never invent data not present in the text
- If a field is not found, use empty string or empty array
- bullets must be an array of strings`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { linkedinText } = await request.json();
    if (!linkedinText) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: PARSE_PROMPT },
        { role: 'user', content: linkedinText }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const resumeData = JSON.parse(completion.choices[0].message.content || '{}');

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: resumeData.name || 'Unknown',
        headline: resumeData.headline || '',
        raw_json: resumeData,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json({ error: 'Failed to parse profile' }, { status: 500 });
  }
}
```

---

### PHASE 3 — Dashboard + Resume Editor

**Hedef:** Kaydedilen profilleri göster, JD yapıştırarak optimize edilmiş CV oluştur.

#### Dashboard (`/dashboard`):
- Kayıtlı profilleri listele (Shadcn `Card` bileşenleri)
- Her profil için "New Optimized Resume" butonu
- Oluşturulan resume'ları listele (slug ile public link göster)

#### Resume Oluşturma Akışı:
1. Profil seç
2. Job Description metni yapıştır
3. "Optimize Resume" butonuna tıkla
4. AI mevcut deneyim bullet'larını JD'ye göre yeniden yazar
5. Benzersiz slug oluşturulur → Supabase'e kaydedilir

#### API Route — `src/app/api/ai/optimize-resume/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OPTIMIZE_PROMPT = `You are an expert resume writer. Your task is to rewrite the experience bullet points to better match the job description.

STRICT RULES:
1. NEVER invent new experiences or skills not in the original
2. ONLY rephrase existing bullet points to emphasize relevant keywords
3. Use strong action verbs
4. Include keywords from the JD naturally
5. Keep each bullet under 120 characters
6. Return ONLY valid JSON with the same structure as input`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { profileId, jobDescription } = await request.json();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: OPTIMIZE_PROMPT },
        {
          role: 'user',
          content: `JOB DESCRIPTION:\n${jobDescription}\n\nORIGINAL RESUME JSON:\n${JSON.stringify(profile.raw_json)}\n\nReturn the complete resume JSON with only the bullet points rewritten to match the JD.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const optimizedData = JSON.parse(completion.choices[0].message.content || '{}');
    const slug = generateSlug();

    // Extract job title from JD (first line or AI extracted)
    const jobTitle = jobDescription.split('\n')[0].slice(0, 100);

    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        profile_id: profileId,
        optimized_json: optimizedData,
        public_link_slug: slug,
        job_title: jobTitle,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Optimize error:', error);
    return NextResponse.json({ error: 'Failed to optimize resume' }, { status: 500 });
  }
}
```

---

### PHASE 4 — Public Links + Subscription Gate

**Hedef:** `/r/[slug]` route'u + abonelik kontrolü.

#### `src/app/r/[slug]/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function PublicResumePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  // 1. Resume'yu bul
  const { data: resume } = await supabase
    .from('resumes')
    .select('*')
    .eq('public_link_slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!resume) redirect('/404');

  // 2. Abonelik kontrolü
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', resume.user_id)
    .single();

  const now = new Date();
  const isExpired =
    !subscription ||
    subscription.status === 'expired' ||
    subscription.status === 'canceled' ||
    (subscription.status === 'trialing' && new Date(subscription.trial_end) < now);

  if (isExpired) redirect('/upgrade');

  // 3. Resume'yu göster
  const data = resume.optimized_json;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
        <p className="text-lg text-gray-600 mt-1">{data.headline}</p>
        <div className="flex gap-4 text-sm text-gray-500 mt-2 flex-wrap">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">Experience</h2>
        {data.experience?.map((exp: any, i: number) => (
          <div key={i} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-gray-600">{exp.company} {exp.location && `· ${exp.location}`}</p>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {exp.start_date} – {exp.end_date}
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              {exp.bullets?.map((bullet: string, j: number) => (
                <li key={j} className="text-gray-700 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">Education</h2>
        {data.education?.map((edu: any, i: number) => (
          <div key={i} className="flex justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">{edu.degree}</p>
              <p className="text-gray-600">{edu.school}</p>
            </div>
            <span className="text-sm text-gray-500">{edu.year}</span>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills?.map((skill: string, i: number) => (
            <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
```

#### `/upgrade` Sayfası:
Aboneliği dolmuş kullanıcılar için yönlendirme sayfası. Stripe Checkout'a bağlı "Upgrade to Pro" butonu.

---

### PHASE 5 — Stripe + PDF + Deployment

**Hedef:** Ödeme entegrasyonu + PDF indirme + Vercel deploy.

#### Stripe Kurulumu:

1. [stripe.com](https://stripe.com) → Dashboard → Products → "Add Product"
2. Ürün adı: "Interview-Ready CV Pro"
3. Fiyat: Yıllık, örn. $49/year
4. Price ID'yi kopyala → `.env.local` → `NEXT_PUBLIC_STRIPE_PRICE_ID`

#### API Route — `src/app/api/stripe/checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
    metadata: { user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}
```

#### Stripe Webhook — `src/app/api/stripe/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  // Service role client — bypasses RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (userId) {
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          status: 'active',
          trial_end: null,
        }, { onConflict: 'user_id' });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('stripe_customer_id', sub.customer as string);
  }

  return NextResponse.json({ received: true });
}
```

#### PDF Export Bileşeni — `src/components/resume/ResumePDF.tsx`:

```typescript
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/types';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  headline: { fontSize: 12, color: '#555', marginBottom: 8 },
  contact: { fontSize: 9, color: '#666', marginBottom: 16, flexDirection: 'row', gap: 12 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: 3, marginBottom: 8, marginTop: 12 },
  expTitle: { fontSize: 10, fontWeight: 'bold' },
  expCompany: { fontSize: 9, color: '#444' },
  bullet: { fontSize: 9, marginLeft: 10, marginBottom: 2 },
  skill: { fontSize: 9, marginRight: 6 },
});

export function ResumePDF({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.name}</Text>
        {data.headline && <Text style={styles.headline}>{data.headline}</Text>}
        <View style={styles.contact}>
          {data.email && <Text>{data.email}</Text>}
          {data.phone && <Text>{data.phone}</Text>}
          {data.location && <Text>{data.location}</Text>}
        </View>

        {data.summary && (
          <>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 9 }}>{data.summary}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>Experience</Text>
        {data.experience?.map((exp, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <Text style={styles.expTitle}>{exp.title} – {exp.company}</Text>
            <Text style={styles.expCompany}>{exp.start_date} – {exp.end_date}</Text>
            {exp.bullets?.map((b, j) => (
              <Text key={j} style={styles.bullet}>• {b}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Education</Text>
        {data.education?.map((edu, i) => (
          <View key={i} style={{ marginBottom: 6 }}>
            <Text style={styles.expTitle}>{edu.degree}</Text>
            <Text style={styles.expCompany}>{edu.school} · {edu.year}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {data.skills?.map((s, i) => (
            <Text key={i} style={styles.skill}>{s}{i < data.skills.length - 1 ? ' ·' : ''}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
```

#### Vercel Deploy:
```bash
npx vercel --prod
```
Tüm `.env.local` değerlerini Vercel Dashboard → Settings → Environment Variables'a ekle.

Stripe webhook için: Stripe Dashboard → Webhooks → "Add endpoint" → `https://your-domain.com/api/stripe/webhook`

---

## ✅ GENEL KURALLAR (Her Phase İçin Geçerli)

1. Her Phase başlamadan önce ne yapacağını 2-3 cümleyle açıkla
2. Tüm yeni dosyaların tam içeriğini yaz — kısmi kod verme
3. Supabase veya Stripe Dashboard'da bir şey yapmam gerekiyorsa adım adım anlat
4. TypeScript hataları olursa düzelt, `any` kullanımını minimumda tut
5. UI: Linear.app tarzı — temiz, minimal, hızlı hissettiren
6. Her Phase sonunda çalışıp çalışmadığını kontrol etmek için ne test edeceğimi söyle

---

## 🚦 BAŞLANGIÇ KOMUTU

Bu dosyayı okudun. **Phase 1'den başla.** 

İlk olarak:
1. Tüm terminal komutlarını çalıştır
2. Dosyaları oluştur
3. Benden Supabase URL ve API Key'lerimi iste
4. SQL şemasını hangi adımlarla çalıştırmam gerektiğini göster

Hazır olduğunda Phase 2'ye geç.
