<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Bench Web / Next.js Production Checklist

> Amaç: `apps/web` altındaki Next.js 16 App Router istemcisini, yerel Fastify API ile çalışan Bench araçları için güvenli, sürdürülebilir ve doğrulanabilir tutmak.

---

## 1. Architecture & Project Structure

- [ ] Route dosyaları yalnızca `src/app/` altında tutuluyor; `page.tsx` route composer olarak kalıyor.
- [ ] İnteraktif araç çalışma alanı ve ekrana ait bileşenler `src/components/ui/` altında kebab-case adlarla bulunuyor.
- [ ] Tulpar primitive’leri yalnızca `src/components/core/` altında tutuluyor; proje-özel bileşenler core dizinine eklenmiyor.
- [ ] `src/components/providers/` yalnızca uygulama çapındaki provider’ları içeriyor.
- [ ] `src/hooks/` tarayıcı state’i, yan etkiler ve tekrar kullanılabilir iş akışı mantığını; `src/types/` ortak tipleri içeriyor.
- [ ] UI ile API/işlem mantığı birbirinden ayrılıyor; Fastify backend kodu `apps/api` altında kalıyor.
- [ ] Yeni ortak UI, mevcut Tulpar core primitive’ini kullanıyor; aynı primitive’in paralel kopyası oluşturulmuyor.
- [ ] Proje içi importlar `@/` alias’ını kullanıyor; derin göreli importlar eklenmiyor.

---

## 2. Next.js App Router

- [ ] `src/app/layout.tsx` global metadata ve `globals.css` için tek giriş noktası olarak kalıyor.
- [ ] Global stil importları yalnızca `src/app/globals.css` içinde yapılıyor; Vite tarzı ikinci bir global CSS giriş dosyası eklenmiyor.
- [ ] `page.tsx` ve `layout.tsx` varsayılan olarak Server Component kalıyor.
- [ ] `"use client"` yalnızca event handler, React state/effect veya tarayıcı API’si gereken en düşük bileşen sınırında kullanılıyor.
- [ ] `localStorage`, `window`, `navigator` ve dosya API’leri ilk SSR render’ında okunmuyor; hydration sonrasında `useEffect` veya kullanıcı etkileşimi ile kullanılıyor.
- [ ] Yeni route’larda gerektiğinde `loading.tsx`, `error.tsx` ve `not-found.tsx` ekleniyor.
- [ ] Metadata, favicon ve route görünürlüğü değiştiğinde App Router metadata dosyaları birlikte gözden geçiriliyor.
- [ ] `next.config.mjs` içindeki rewrite’lar `/api/*` ve `/health` isteklerini `BENCH_API_ORIGIN` ya da varsayılan yerel Fastify API’ye yönlendirmeye devam ediyor.

---

## 3. Code Quality

- [ ] TypeScript strict kalıyor; `any`, `@ts-ignore` ve doğrulanmamış type assertion kullanılmıyor.
- [ ] Kullanıcıya ait veya API’den gelen `unknown` veri type guard ile doğrulanıyor.
- [ ] Bileşenler sorumluluğa göre bölünüyor; yeni dosyalar kebab-case adlandırılıyor.
- [ ] Sabit araç tanımları, formatlar ve profil değerleri uygun `types`, `constants` veya config katmanına taşınıyor.
- [ ] Kullanılmayan import, dependency ve eski Vite dosyaları bırakılmıyor.
- [ ] Üretim kodunda `console.log` ve geçici debug kodu bırakılmıyor.

---

## 4. Local API & File Processing

- [ ] İstemci yalnızca relative `/api/*` ve `/health` yollarını kullanıyor; yerel API adresi UI bileşenlerine gömülmüyor.
- [ ] API hata yanıtları kullanıcıya anlaşılır Türkçe mesajlarla gösteriliyor; başarısız işlem başarı gibi sunulmuyor.
- [ ] Ghostscript veya MarkItDown eksikse ilgili API’nin gerçek hata durumunu koru; sahte çıktı veya statik başarı üretme.
- [ ] Dosya tipi, imza, boyut, dosya sayısı, kuyruk ve timeout kontrolleri backend’de korunuyor; yalnızca client doğrulamasına güvenilmiyor.
- [ ] Çoklu dosya akışında görünür dosya listesi, toplamlar ve gerçek sonuç ölçümleri korunuyor.
- [ ] Tahmini boyutlar açıkça tahmin olarak etiketleniyor; işlem sonrası gerçek PDF ve ZIP ölçümleriyle karıştırılmıyor.
- [ ] API sözleşmesi değişirse `apps/api` testleri ile web hook’larının isteği/yanıtı birlikte güncelleniyor.

---

## 5. Security & Privacy

- [ ] Secret, API anahtarı veya makineye özel yol client bundle’a eklenmiyor; yapılandırma environment üzerinden alınıyor.
- [ ] Uygulamanın local-first sınırı korunuyor: dosyalar üçüncü taraf buluta gönderilmiyor, dosya içeriği loglanmıyor.
- [ ] `localStorage` yalnızca hassas olmayan UI tercihi ve oturum istatistiği için kullanılıyor; dosya içeriği, parola veya token yazılmıyor.
- [ ] Dosya adı ve kullanıcı girdisi DOM’a veya indirme adına aktarılmadan önce güvenli backend doğrulamasından geçiyor.
- [ ] `next.config.mjs` güvenlik başlıkları zayıflatılmıyor; yeni harici kaynak gerekiyorsa CSP, CORS ve izin etkisi ayrıca değerlendiriliyor.
- [ ] İstemci taraftaki alan kısıtları kullanıcı deneyimi içindir; gerçek upload limitleri ve rate/queue koruması API’de kalır.

---

## 6. Error Handling & UX

- [ ] Her araç için idle, dosya seçili, işlem sürüyor, başarı ve hata durumları anlaşılır biçimde sunuluyor.
- [ ] İşlem sürerken çifte submit, mod değişimi ve çakışan dosya eylemleri engelleniyor.
- [ ] Hata durumunda kullanıcı dosyalarını yeniden seçmek veya işleme devam etmek için anlaşılır bir yol görüyor.
- [ ] Responsive düzen masaüstü ve dar ekranlarda kontrol ediliyor; metinler çakışmıyor veya bitişmiyor.
- [ ] Klavye erişimi, görünür odak durumu, açıklayıcı etiketler ve canlı durum mesajları korunuyor.
- [ ] Süslü ama işlevsiz dekorasyon, sahte ürün iddiası ve gereksiz animasyon eklenmiyor.

---

## 7. Performance

- [ ] Büyük veya nadir kullanılan araç UI’ları yalnızca ölçülmüş bir fayda varsa dynamic import ile ayrılıyor.
- [ ] Çoklu dosyada istemci belleğini gereksiz büyüten kopyalama/önizleme akışları eklenmiyor.
- [ ] API kuyruk sınırları ve sequential disk işleme korunuyor; bellek içi toplu işleme eklenmiyor.
- [ ] Görsel, font veya üçüncü taraf paket eklemeden önce bundle ve local-first gizlilik etkisi değerlendiriliyor.
- [ ] Layout shift yaratacak sonuç alanları için stabil alan ve uygun loading durumu kullanılıyor.

---

## 8. Testing / QA

- [ ] Web değişikliklerinden sonra en az `pnpm --filter @bench/web typecheck` çalıştırılıyor.
- [ ] UI, build zinciri veya App Router değiştiğinde `pnpm --filter @bench/web build` çalıştırılıyor.
- [ ] Hook, parser veya API sözleşmesi değiştiğinde ilgili Vitest testleri eklenip `pnpm --filter @bench/web test` çalıştırılıyor.
- [ ] API değişikliklerinde `pnpm --filter @bench/api typecheck` ve `pnpm --filter @bench/api test` çalıştırılıyor.
- [ ] Tam doğrulama gerektiğinde `pnpm typecheck`, `pnpm test` ve `pnpm build` çalıştırılıyor.
- [ ] Tarayıcı doğrulamasında sağlık durumu, her araç kategorisine geçiş, dosya seçim/hata/success akışları ve mobil görünüm kontrol ediliyor.
- [ ] Build/test sonucu ile gerçek tarayıcı doğrulaması birbirinden ayrı raporlanıyor.
