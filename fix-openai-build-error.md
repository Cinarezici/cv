# OpenAI/Apify Build Hatası Çözümü (Genişletilmiş)

Vercel üzerinde aldığınız `Missing credentials. Please pass an apiKey, or set the OPENAI_API_KEY environment variable.` hatası, Next.js'in build (derleme) aşamasında API rotalarını kontrol ederken bu anahtarları bulamamasından kaynaklanmaktadır.

## Yapılan Değişiklikler

### 1. Lazy Initialization (Geç Başlatma)
OpenAI ve Apify istemcilerinin (client) dosyanın en üstünde başlatılması yerine, sadece istek geldiğinde (handler veya library fonksiyonu içerisinde) başlatılması sağlandı. Bu sayede derleme aşamasında kütüphaneler yüklendiğinde anahtar kontrolü yapılmaz.

**Örnek Değişiklik:**
```typescript
// ESKİ: Kütüphane yüklendiği an hata veriyordu
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function processData() {
  // ...
}

// YENİ: Sadece fonksiyon çağrıldığında çalışır
export async function processData() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // ...
}
```

### 2. Dynamic Route Zorlaması
Tüm AI ve arama rotalarına `export const dynamic = 'force-dynamic';` eklendi. Bu, Next.js'e bu sayfaların statik olarak derlenmeye çalışılmamasını söyler.

### 3. Etkilenen Dosyalar (Tam Liste)

#### Rotalar (Routes)
- `src/app/api/jobs/generate-letter/route.ts`
- `src/app/api/scout/route.ts`
- `src/app/api/jobs/search/route.ts`
- `src/app/api/ai/parse-linkedin/route.ts`
- `src/app/api/ai/parse-pdf/route.ts`
- `src/app/api/ai/optimize-resume/route.ts`

#### Kütüphaneler (Libraries)
- `src/lib/letter-generator.ts`
- `src/lib/company-research.ts`
- `src/lib/apify-company-scraper.ts`

## Sonraki Adımlarda Ne Yapılmalı?
Bu değişiklikleri GitHub'a push ettiğinizde Vercel üzerindeki build "başarılı" (Success) olacaktır. Deployment sonrasında Vercel Dashboard üzerinden `OPENAI_API_KEY` ve `APIFY_API_TOKEN` değişkenlerinin doğru set edildiğinden emin olun.
