# Bench

Tarayıcı arayüzü ve REST API ile çalışan, tüm işlemleri yalnızca kendi bilgisayarınızda yerel olarak yürüten gizlilik odaklı dosya, belge ve veri araç seti.

---

[English Documentation Below](#bench---english)

---

## Yetenekler

1. **PDF Sıkıştırma (Compress):**
   - Ghostscript tabanlı güçlü yerel sıkıştırma (Hafif, Dengeli, Güçlü).
   - **Hassas Meta Veri Temizleme:** Yazar adı, oluşturma/düzenleme tarihi ve PDF'i üreten yazılım izlerini sıfırlayan gizlilik koruması.
   - Tek dosya için doğrudan sıkıştırılmış `.pdf` indirme, çoklu dosyalar için tek paket `.zip` indirme.
   - Varsayılan olarak dosya başına 128 MB ve istek başına 20 dosya; ortam değişkenleriyle ayarlanabilir güvenli sınırlar.

2. **Belge → Markdown & AI Hazır Metin (Markdown):**
   - Microsoft MarkItDown motoru ile PDF, Word (`.docx`), Excel (`.xlsx`) ve PowerPoint (`.pptx`) dosyalarını dönüştürme.
   - Çoklu dosya desteği: İster ayrı ayrı gezinip indirin, ister tümünü tek bir birleşik `.md` dosyasında toplayın.
   - **Rendered / Raw Önizleme:** Biçimlendirilmiş zengin görünüm (başlıklar, tablolar, kod blokları) veya ham Markdown kodu arasında anında geçiş.
   - **AI Context Yardımcısı:** Yaklaşık Token, Kelime ve Karakter sayısı hesaplama.
   - **LLM Context Kopyala:** Metni Claude, ChatGPT, Gemini veya yerel modellere beslemeye hazır `<document name="...">...</document>` etiketiyle tek tıkla kopyalama.

3. **PDF Birleştirme (Merge):**
   - `pdf-lib` ile saf Node.js üzerinde çalışan sıfır kayıplı PDF birleştirici.
   - Dosyaları yukarı/aşağı butonlarıyla dilediğiniz sırada düzenleme.
   - Sayfa sayısını koruyarak tek tıkla `birlesik-belge.pdf` çıktısı.

4. **PDF → Görsel Dönüştürme (PDF to PNG):**
   - Ghostscript motoru ile PDF sayfalarını tek tıkla kristal netliğinde PNG görsellerine dönüştürme.
   - 150 DPI (Standart Ekran/Web) ve 300 DPI (Baskı/Arşiv Kalitesi) çözünürlük seçenekleri.
   - Tek sayfada doğrudan `.png`, çok sayfalı belgelerde `sayfalar-png.zip` indirme.

5. **Görsel Dönüştürücü & Optimize Edici (Image Engine - Sharp):**
   - WebP, AVIF, JPEG ve PNG formatları arasında kayıpsız/kontrollü kayıplı dönüştürme.
   - Hassas EXIF ve GPS konum verilerini sıfırlayan gizlilik koruması.
   - Kalite kontrolü ve orantılı maksimum genişlik/yükseklik boyutlandırma.
   - Tek görsel için doğrudan dosya, çoklu görseller için `optimized-images.zip`.

6. **Kripto Kasa & Dosya Bütünlüğü (Crypto Vault - AES-256-GCM):**
   - Node.js yerel `node:crypto` motoruyla çalışan kimlik doğrulamalı AES-256-GCM dosya şifreleme ve çözme.
   - Paroladan scrypt ile anahtar türetme, rastgele salt ve GCM kimlik doğrulama etiketi ile tam koruma.
   - SHA-256, SHA-512 ve MD5 dosya bütünlüğü / Checksum üretici ve tek tıkla kopyalama.

7. **Yapılandırılmış Veri Dönüştürücü (CSV ↔ JSON ↔ YAML):**
   - CSV, JSON ve YAML arasında standartlara uygun çift yönlü dönüştürme.
   - Dosya yükleme veya doğrudan metin kutusuna yapıştırma desteği.
   - Satır sayısı ve sütun analizi ile anında önizleme, kopyalama veya indirme.

8. **Kalıcı Tercihler & İstatistikler:**
   - Son çalışılan mod, tercih edilen sıkıştırma düzeyi ve Markdown önizleme modu `localStorage` ile hatırlanır.
   - Oturum boyunca ve zaman içinde işlenen toplam dosya hacmi ile kazanılan disk alanı gerçek zamanlı takip edilir.

---

## Geliştirici Yerel Kurulum Rehberi (Prerequisites & Setup)

Bench'i kendi makinenizde çalıştırmak için sisteminizde bulunması gereken temel bileşenler ve işletim sistemlerine göre kurulum yöntemleri aşağıdadır:

### 1. Gereksinim Tablosu

| Bileşen         | Minimum Sürüm     | Kullanım Amacı                              | İndirme / Kaynak                                                           |
| --------------- | ----------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| **Node.js**     | 20.x veya 22+ LTS | API ve Web uygulaması çalışma zamanı        | [nodejs.org](https://nodejs.org/)                                          |
| **pnpm**        | 9.x veya 10.x     | Hızlı ve verimli paket yöneticisi           | [pnpm.io](https://pnpm.io/)                                                |
| **Ghostscript** | 10.x+             | Yerel PDF sıkıştırma ve görsel motoru       | [ghostscript.com](https://www.ghostscript.com/releases.html)               |
| **Python**      | 3.10+             | MarkItDown dönüştürücü çalıştırma ortamı    | [python.org](https://python.org/)                                          |
| **MarkItDown**  | Güncel            | PDF & Office belgelerini Markdown'a çevirme | [github.com/microsoft/markitdown](https://github.com/microsoft/markitdown) |

---

### 2. İşletim Sistemine Göre Kurulum Komutları

#### macOS (Homebrew ile)

```sh
# 1. Node.js ve pnpm
brew install node
corepack enable
corepack prepare pnpm@latest --activate

# 2. Ghostscript (PDF Sıkıştırma ve PNG Görsel için zorunlu)
brew install ghostscript

# 3. Python 3 ve MarkItDown (Belge -> Markdown için zorunlu)
brew install python
python3 -m venv .venv-markitdown
source .venv-markitdown/bin/activate
pip install 'markitdown[all]'
```

#### Linux (Debian / Ubuntu)

```sh
# 1. Node.js (NodeSource 20.x/22.x) ve pnpm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
corepack enable
corepack prepare pnpm@latest --activate

# 2. Ghostscript
sudo apt-get install -y ghostscript

# 3. Python 3 ve MarkItDown
sudo apt-get install -y python3 python3-pip python3-venv
python3 -m venv .venv-markitdown
source .venv-markitdown/bin/activate
pip install 'markitdown[all]'
```

#### Windows (winget veya Manuel)

```powershell
# 1. Node.js ve pnpm
winget install OpenJS.NodeJS.LTS
corepack enable
corepack prepare pnpm@latest --activate

# 2. Ghostscript
winget install ArtifexSoftware.Ghostscript
# veya: https://www.ghostscript.com/releases.html adresinden 64-bit yükleyiciyi kurun.

# 3. Python 3 ve MarkItDown
winget install Python.Python.3.12
python -m venv .venv-markitdown
.venv-markitdown\Scripts\activate
pip install markitdown[all]
```

> **Not:** Proje API'si (`config.ts`), proje kökündeki `.venv-markitdown/bin/markitdown` (Windows'ta `Scripts\markitdown.exe`) yolunu otomatik olarak algılar. Bu nedenle sanal ortamı `.venv-markitdown` adıyla oluşturursanız ek ortam değişkeni tanımlamanıza gerek kalmaz.

---

### 3. Projeyi Başlatma

Tüm bağımlılıklar kurulduktan sonra projeyi başlatmak için şu adımları izleyin:

```sh
# Bağımlılıkları yükleyin
pnpm install

# Hem API (Fastify) hem Web (Next.js) sunucusunu eşzamanlı başlatın
pnpm dev
```

- **Web Arayüzü:** [http://localhost:5173](http://localhost:5173)
- **API Servisi:** [http://localhost:8787](http://localhost:8787)
- **Sağlık & Motor Kontrolü:** [http://localhost:8787/health](http://localhost:8787/health)

Tarayıcınızdan `http://localhost:8787/health` adresini açtığınızda aşağıdaki çıktıyı görüyorsanız tüm yerel motorlar başarıyla hazırdır:

```json
{
  "status": "ok",
  "ghostscript": true,
  "markitdown": true,
  "features": [
    "compress",
    "markdown",
    "merge",
    "images",
    "sanitize",
    "imageOptimize",
    "crypto",
    "data"
  ],
  "supportedMarkdownFormats": ["pdf", "docx", "xlsx", "pptx"],
  "uploadLimits": { "fileSize": 134217728, "fileCount": 20 },
  "jobLimits": { "concurrent": 2, "queued": 20, "active": 0, "waiting": 0 }
}
```

---

### 4. Gelişmiş Ortam Değişkenleri (Opsiyonel)

Gerektiğinde `apps/api/.env` dosyası oluşturarak aşağıdaki ortam değişkenlerini geçersiz kılabilirsiniz:

| Değişken                 | Varsayılan                               | Açıklama                                              |
| ------------------------ | ---------------------------------------- | ----------------------------------------------------- |
| `PORT`                   | `8787`                                   | API dinleme portu.                                    |
| `HOST`                   | `127.0.0.1`                              | API dinleme adresi (yerel erişim).                    |
| `GHOSTSCRIPT_BIN`        | `gs`                                     | Ghostscript çalıştırılabilir dosya yolu.              |
| `MARKITDOWN_BIN`         | `.venv-markitdown/...` veya `markitdown` | MarkItDown CLI ikili dosya yolu.                      |
| `COMPRESSION_TIMEOUT_MS` | `120000` (2 dk)                          | Büyük PDF sıkıştırmalarında izin verilen azami süre.  |
| `MARKDOWN_TIMEOUT_MS`    | `120000` (2 dk)                          | Büyük doküman dönüşümlerinde izin verilen azami süre. |
| `MAX_UPLOAD_BYTES`       | `134217728` (128 MB)                     | Tek bir yükleme dosyası için azami byte sınırı.       |
| `MAX_UPLOAD_FILES`       | `20`                                     | Tek istekte kabul edilen azami dosya sayısı.          |
| `MAX_DATA_INPUT_BYTES`   | `10485760` (10 MB)                       | Doğrudan yapıştırılan veri için azami byte sınırı.    |
| `MAX_CONCURRENT_JOBS`    | `2`                                      | Aynı anda çalıştırılabilen ağır işlem sayısı.         |
| `MAX_QUEUED_JOBS`        | `20`                                     | Bekleme kuyruğunda tutulabilen azami işlem sayısı.    |
| `JOB_QUEUE_TIMEOUT_MS`   | `30000` (30 sn)                          | Bir işlemin kuyrukta bekleyebileceği azami süre.      |

---

### 5. Sık Karşılaşılan Sorunlar ve Çözümleri (Troubleshooting)

1. **`Ghostscript bulunamadı (503)` Hatası:**
   - Terminalinizde `gs --version` komutunu çalıştırarak Ghostscript'in `PATH` üzerinde tanımlı olup olmadığını test edin.
   - `brew install ghostscript` veya `sudo apt install ghostscript` komutunu çalıştırdıktan sonra geliştirme sunucusunu (`pnpm dev`) yeniden başlatın.

2. **`MarkItDown bulunamadı (503)` Hatası:**
   - Proje kök dizininde `.venv-markitdown` klasörünün varlığından ve içinde `markitdown` paketinin kurulu olduğundan emin olun.
   - Alternatif olarak sistem genelinde `pip install 'markitdown[all]'` veya `pipx install 'markitdown[all]'` çalıştırabilirsiniz.
   - MarkItDown özel bir dizindeyse `MARKITDOWN_BIN=/özel/yol/markitdown pnpm dev` şeklinde belirtebilirsiniz.

3. **Port Çakışması (`EADDRINUSE: 8787` veya `5173`):**
   - Portu kullanan eski bir süreç açıksa:
     - macOS/Linux: `lsof -i :8787` veya `kill -9 $(lsof -t -i :8787)`
     - Windows: `netstat -ano | findstr :8787`

---

## API Uç Noktaları

| Uç Nokta                | Metot | Açıklama                                                                                                            |
| ----------------------- | ----- | ------------------------------------------------------------------------------------------------------------------- |
| `/api/compress`         | POST  | 1 veya daha fazla PDF'i sıkıştırır; opsiyonel `stripMetadata=true` ile EXIF/meta verileri sıfırlar.                 |
| `/api/convert/markdown` | POST  | PDF, DOCX, XLSX, PPTX belgelerini dönüştürür; JSON içinde dosyalar, birleşik metin ve token istatistiklerini döner. |
| `/api/merge`            | POST  | 2 veya daha fazla PDF belgesini sırasıyla birleştirip tek bir `.pdf` stream olarak döner.                           |
| `/api/convert/images`   | POST  | PDF sayfalarını 150 veya 300 DPI çözünürlükte PNG'ye dönüştürür (tek sayfa `.png`, çoklu `.zip`).                   |
| `/api/images/process`   | POST  | Görselleri WebP, AVIF, JPEG, PNG formatlarına dönüştürür, EXIF temizler ve boyutlandırır.                           |
| `/api/crypto/encrypt`   | POST  | Herhangi bir dosyayı parola ile AES-256-GCM algoritmasıyla şifreler (`.enc` çıktısı).                               |
| `/api/crypto/decrypt`   | POST  | Parola ile şifrelenmiş `.enc` dosyasının şifresini çözer ve orijinal halini döner.                                  |
| `/api/crypto/hash`      | POST  | Dosyanın SHA-256, SHA-512 ve MD5 hash değerlerini hesaplar.                                                         |
| `/api/data/convert`     | POST  | CSV, JSON ve YAML verilerini çift yönlü olarak dönüştürür (JSON gövdesi veya dosya yükleme).                        |
| `/health`               | GET   | Ghostscript, MarkItDown ve desteklenen tüm modların durumunu listeler.                                              |

---

## Davranış ve Gizlilik

- Yüklenen dosyalar yalnızca API sürecinin geçici bellek/scratch klasöründe tutulur.
- İşlem bittiğinde (başarılı veya hatalı) geçici çalışma klasörleri işletim sistemi üzerinden silinir. Bu işlem güvenli disk üzerine yazma (secure erase) garantisi vermez.
- Sıfır telemetri, sıfır bulut transferi. Dosyalarınız bilgisayarınızdan asla ayrılmaz.

---

## Lisans

Bu proje **Kişisel ve Gayri Ticari Kullanım Lisansı** ile korunmaktadır.

- Kişisel, eğitim, test ve kâr amacı gütmeyen bireysel kullanımlar için tamamen ücretsizdir.
- Telif sahibinin önceden yazılı izni olmaksızın **herhangi bir ticari amaçla (satış, SaaS, gelir getiren kurumsal faaliyetler vb.) kullanılması kesinlikle yasaktır**.
- Detaylar için [LICENSE](LICENSE) dosyasına bakabilirsiniz. Ticari lisans talepleri için: `gok.zaferr@gmail.com`.

---

---

# Bench - English

A privacy-first local file, document, and data toolkit powered by a web UI and a local REST API. Every operation runs strictly on your machine with zero cloud transfer.

---

## Features

1. **PDF Compression (Compress):**
   - Ghostscript-based local compression with three presets (Light, Balanced, Strong).
   - **Sensitive Metadata Sanitization:** Wipes author names, creation/modification dates, and producer software traces.
   - Direct `.pdf` download for single files; automatic `.zip` bundle for batch files.
   - Configurable limits: defaults to 128 MB per file and 20 files per request.

2. **Documents → Markdown & AI-Ready Context (Markdown):**
   - Converts PDF, Word (`.docx`), Excel (`.xlsx`), and PowerPoint (`.pptx`) via Microsoft MarkItDown engine.
   - Batch support: browse/download files individually or merge them into a single consolidated `.md`.
   - **Rendered / Raw Toggle:** Switch between rich rendered view (headings, tables, syntax-highlighted code blocks) and raw Markdown code.
   - **AI Context Inspector:** Accurate live estimation of Token, Word, and Character counts.
   - **LLM Context Copy:** Single-click copy formatted with `<document name="...">...</document>` tags, ready to feed into Claude, ChatGPT, Gemini, or local models.

3. **PDF Merger (Merge):**
   - Pure Node.js zero-loss PDF merger via `pdf-lib`.
   - Reorder files intuitively with up/down controls.
   - Preserves complete document structure and exports `birlesik-belge.pdf` stream instantly.

4. **PDF to Images (PDF to PNG):**
   - Renders PDF pages to crisp PNG images via Ghostscript.
   - 150 DPI (Standard Screen/Web) and 300 DPI (Print/Archival Quality) resolutions.
   - Direct `.png` download for single-page files, or a bundled `.zip` archive for multi-page documents.

5. **Image Optimizer & Converter (Image Engine - Sharp):**
   - Format conversion across WebP, AVIF, JPEG, and PNG.
   - Strips sensitive EXIF and GPS location data.
   - Quality control and proportional max width/height resizing.
   - Single image direct download or `optimized-images.zip` for batch jobs.

6. **Crypto Vault & File Integrity (Crypto Vault - AES-256-GCM):**
   - Authenticated AES-256-GCM encryption and decryption powered by Node.js native `node:crypto`.
   - Key derivation using scrypt, random cryptographic salt, and GCM authentication tag verification.
   - Checksum generator: Computes SHA-256, SHA-512, and MD5 hashes with one-click copy.

7. **Structured Data Converter (CSV ↔ JSON ↔ YAML):**
   - Bi-directional standard-compliant conversion between CSV, JSON, and YAML formats.
   - Supports file uploads as well as direct text paste.
   - Live row count and column structure inspection with copy/download options.

8. **Persistent Preferences & Local Statistics:**
   - Active workflow mode, preferred compression level, and Markdown preview preferences are stored locally via `localStorage`.
   - Tracks total processed files and cumulative saved disk space in real time across sessions.

---

## Developer Setup Guide (Prerequisites & Setup)

To run Bench locally on your workstation, ensure the following core dependencies are installed:

### 1. Requirements

| Component       | Minimum Version | Purpose                                    | Download / Reference                                                       |
| --------------- | --------------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| **Node.js**     | 20.x or 22+ LTS | API and Web application runtime            | [nodejs.org](https://nodejs.org/)                                          |
| **pnpm**        | 9.x or 10.x     | Fast & efficient package manager           | [pnpm.io](https://pnpm.io/)                                                |
| **Ghostscript** | 10.x+           | Local PDF compression and rendering engine | [ghostscript.com](https://www.ghostscript.com/releases.html)               |
| **Python**      | 3.10+           | MarkItDown execution environment           | [python.org](https://python.org/)                                          |
| **MarkItDown**  | Latest          | Document-to-Markdown conversion CLI        | [github.com/microsoft/markitdown](https://github.com/microsoft/markitdown) |

---

### 2. Installation Commands by Operating System

#### macOS (via Homebrew)

```sh
# 1. Node.js & pnpm
brew install node
corepack enable
corepack prepare pnpm@latest --activate

# 2. Ghostscript (Required for PDF compression & PNG rendering)
brew install ghostscript

# 3. Python 3 & MarkItDown (Required for Document -> Markdown conversion)
brew install python
python3 -m venv .venv-markitdown
source .venv-markitdown/bin/activate
pip install 'markitdown[all]'
```

#### Linux (Debian / Ubuntu)

```sh
# 1. Node.js (NodeSource 20.x/22.x) & pnpm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
corepack enable
corepack prepare pnpm@latest --activate

# 2. Ghostscript
sudo apt-get install -y ghostscript

# 3. Python 3 & MarkItDown
sudo apt-get install -y python3 python3-pip python3-venv
python3 -m venv .venv-markitdown
source .venv-markitdown/bin/activate
pip install 'markitdown[all]'
```

#### Windows (via winget or Manual)

```powershell
# 1. Node.js & pnpm
winget install OpenJS.NodeJS.LTS
corepack enable
corepack prepare pnpm@latest --activate

# 2. Ghostscript
winget install ArtifexSoftware.Ghostscript
# or download the 64-bit installer from https://www.ghostscript.com/releases.html

# 3. Python 3 & MarkItDown
winget install Python.Python.3.12
python -m venv .venv-markitdown
.venv-markitdown\Scripts\activate
pip install markitdown[all]
```

> **Note:** The backend API automatically detects `.venv-markitdown/bin/markitdown` (or `Scripts\markitdown.exe` on Windows) at the repository root. Setting up the virtual environment with this name requires no additional environment configuration.

---

### 3. Starting the Project

Once all prerequisites are installed, run:

```sh
# Install dependencies
pnpm install

# Start both Fastify API and Next.js Web dev servers concurrently
pnpm dev
```

- **Web UI:** [http://localhost:5173](http://localhost:5173)
- **API Server:** [http://localhost:8787](http://localhost:8787)
- **Engine Health Check:** [http://localhost:8787/health](http://localhost:8787/health)

A healthy engine status response looks like this:

```json
{
  "status": "ok",
  "ghostscript": true,
  "markitdown": true,
  "features": [
    "compress",
    "markdown",
    "merge",
    "images",
    "sanitize",
    "imageOptimize",
    "crypto",
    "data"
  ],
  "supportedMarkdownFormats": ["pdf", "docx", "xlsx", "pptx"],
  "uploadLimits": { "fileSize": 134217728, "fileCount": 20 },
  "jobLimits": { "concurrent": 2, "queued": 20, "active": 0, "waiting": 0 }
}
```

---

### 4. Advanced Environment Variables (Optional)

You can override defaults by creating an `apps/api/.env` file:

| Variable                 | Default                                | Description                                           |
| ------------------------ | -------------------------------------- | ----------------------------------------------------- |
| `PORT`                   | `8787`                                 | API port.                                             |
| `HOST`                   | `127.0.0.1`                            | Host binding (local loopback).                        |
| `GHOSTSCRIPT_BIN`        | `gs`                                   | Path to Ghostscript executable.                       |
| `MARKITDOWN_BIN`         | `.venv-markitdown/...` or `markitdown` | Path to MarkItDown CLI executable.                    |
| `COMPRESSION_TIMEOUT_MS` | `120000` (2 min)                       | Maximum allowed timeout for heavy PDF compression.    |
| `MARKDOWN_TIMEOUT_MS`    | `120000` (2 min)                       | Maximum allowed timeout for heavy document parse.     |
| `MAX_UPLOAD_BYTES`       | `134217728` (128 MB)                   | Max byte limit per uploaded file.                     |
| `MAX_UPLOAD_FILES`       | `20`                                   | Maximum files allowed per request.                    |
| `MAX_DATA_INPUT_BYTES`   | `10485760` (10 MB)                     | Maximum byte size for pasted raw data.                |
| `MAX_CONCURRENT_JOBS`    | `2`                                    | Concurrency ceiling for heavy background worker jobs. |
| `MAX_QUEUED_JOBS`        | `20`                                   | Maximum queue depth for pending jobs.                 |
| `JOB_QUEUE_TIMEOUT_MS`   | `30000` (30 sec)                       | Maximum time a job may stay in waiting queue.         |

---

### 5. Troubleshooting

1. **`Ghostscript not found (503)`:**
   - Verify `gs --version` works in your terminal.
   - Install via `brew install ghostscript` or `sudo apt install ghostscript`, then restart the server (`pnpm dev`).

2. **`MarkItDown not found (503)`:**
   - Confirm `.venv-markitdown` exists in project root with `markitdown` installed.
   - Or install globally via `pip install 'markitdown[all]'`.
   - Specify custom path with `MARKITDOWN_BIN=/custom/path/markitdown pnpm dev`.

3. **Port Conflicts (`EADDRINUSE: 8787` or `5173`):**
   - Terminate lingering processes:
     - macOS/Linux: `kill -9 $(lsof -t -i :8787)`
     - Windows: `netstat -ano | findstr :8787`

---

## API Endpoints

| Endpoint                | Method | Description                                                                                            |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `/api/compress`         | POST   | Compresses 1 or more PDFs; optionally strips EXIF/metadata with `stripMetadata=true`.                  |
| `/api/convert/markdown` | POST   | Converts PDF, DOCX, XLSX, PPTX files; returns JSON with individual files, combined text & token stats. |
| `/api/merge`            | POST   | Merges 2 or more PDFs sequentially into a single downloadable `.pdf` stream.                           |
| `/api/convert/images`   | POST   | Converts PDF pages to 150/300 DPI PNG images (single file `.png`, multi-page `.zip`).                  |
| `/api/images/process`   | POST   | Optimizes images to WebP, AVIF, JPEG, PNG, sanitizes EXIF, and resizes dimensions.                     |
| `/api/crypto/encrypt`   | POST   | Encrypts any file with AES-256-GCM using a user passphrase (outputs `.enc`).                           |
| `/api/crypto/decrypt`   | POST   | Decrypts an encrypted `.enc` file using the passphrase back to its original format.                    |
| `/api/crypto/hash`      | POST   | Computes SHA-256, SHA-512, and MD5 file hashes for data integrity verification.                        |
| `/api/data/convert`     | POST   | Converts structured data between CSV, JSON, and YAML bi-directionally (via JSON body or file upload).  |
| `/health`               | GET    | Returns status of Ghostscript, MarkItDown, and all active engine capabilities.                         |

---

## Behavior & Privacy Guarantees

- Uploaded files are written only to temporary ephemeral directories owned by the API process.
- All temporary scratch directories are strictly removed upon request completion (success or error).
- Zero telemetry, zero external trackers, zero cloud transfer. Your data stays strictly on your computer.

---

## License

This project is licensed under a **Non-Commercial & Personal Use Software License**.

- Free for personal, educational, evaluation, and non-commercial purposes.
- **Commercial use, redistribution as a paid product/SaaS, or monetization without prior written permission is strictly prohibited.**
- For full license details, see the [LICENSE](LICENSE) file. For commercial inquiries: `gok.zaferr@gmail.com`.
