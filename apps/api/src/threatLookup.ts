import { ApiError } from './errors.js';

export interface ThreatStats {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
}

export interface ThreatQuota {
  dailyUsed: number;
  dailyAllowed: number;
  monthlyUsed: number;
  monthlyAllowed: number;
}

export interface ThreatReport {
  hash: string;
  status: 'clean' | 'suspicious' | 'malicious' | 'unknown';
  reputation: string;
  provider: 'circl' | 'virustotal';
  trustScore?: number;
  fileName?: string;
  fileSize?: string;
  database?: string;
  stats?: ThreatStats;
  quota?: ThreatQuota;
  queriedAt: string;
}

const SHA256_REGEX = /^[a-fA-F0-9]{64}$/;

export function validateSha256(hash: string): string {
  const trimmed = hash.trim().toLowerCase();
  if (!SHA256_REGEX.test(trimmed)) {
    throw new ApiError(
      400,
      'INVALID_HASH',
      'Geçersiz SHA-256 hash değeri. 64 karakterli onaltılık (hex) dize olmalıdır.',
    );
  }
  return trimmed;
}

async function queryCircl(hash: string): Promise<ThreatReport | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://hashlookup.circl.lu/lookup/sha256/${hash}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Bench-Security-Suite/1.0',
        },
        signal: controller.signal,
      },
    );

    if (res.status === 404) {
      return {
        hash,
        status: 'unknown',
        reputation:
          'Bilinmeyen Dosya (Tehdit/yazılım veritabanlarında eşleşme yok)',
        provider: 'circl',
        queriedAt: new Date().toISOString(),
      };
    }

    if (!res.ok) return null;

    const data = (await res.json()) as Record<string, unknown>;
    const rawTrust = data['hashlookup:trust'];
    const trust = typeof rawTrust === 'number' ? rawTrust : 100;
    const fileName =
      typeof data.FileName === 'string' ? data.FileName : undefined;
    const fileSize =
      typeof data.FileSize === 'string' ? data.FileSize : undefined;
    const db = typeof data.db === 'string' ? data.db : undefined;

    const isClean = trust >= 50;
    return {
      hash,
      status: isClean ? 'clean' : 'suspicious',
      reputation: isClean
        ? 'Doğrulanmış Güvenli Yazılım Kaydı'
        : 'Şüpheli Kayıt',
      provider: 'circl',
      trustScore: trust,
      fileName,
      fileSize,
      database: db,
      queriedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function queryVirusTotal(
  hash: string,
  apiKey: string,
): Promise<ThreatReport | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
      headers: {
        'x-apikey': apiKey,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (res.status === 404) {
      return {
        hash,
        status: 'unknown',
        reputation: 'Bilinmeyen Dosya (VirusTotal üzerinde kayıt yok)',
        provider: 'virustotal',
        queriedAt: new Date().toISOString(),
      };
    }

    if (!res.ok) return null;

    const body = (await res.json()) as {
      data?: { attributes?: { last_analysis_stats?: Record<string, number> } };
    };
    const statsObj = body?.data?.attributes?.last_analysis_stats || {};

    const stats: ThreatStats = {
      malicious: Number(statsObj.malicious || 0),
      suspicious: Number(statsObj.suspicious || 0),
      harmless: Number(statsObj.harmless || 0),
      undetected: Number(statsObj.undetected || 0),
    };

    let status: ThreatReport['status'] = 'clean';
    let reputation = 'Temiz (Zararlı tespit edilmedi)';

    if (stats.malicious > 0) {
      status = 'malicious';
      reputation = `Zararlı (${stats.malicious} motor tehdit bildirdi)`;
    } else if (stats.suspicious > 0) {
      status = 'suspicious';
      reputation = `Şüpheli (${stats.suspicious} motor şüpheli bildirdi)`;
    }

    return {
      hash,
      status,
      reputation,
      provider: 'virustotal',
      stats,
      queriedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchVirusTotalQuota(
  apiKey: string,
): Promise<ThreatQuota | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(
      `https://www.virustotal.com/api/v3/users/${apiKey}`,
      {
        headers: {
          'x-apikey': apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      },
    );

    if (!res.ok) return null;

    const body = (await res.json()) as {
      data?: {
        attributes?: {
          quotas?: Record<string, { used?: number; allowed?: number }>;
        };
      };
    };

    const quotas = body?.data?.attributes?.quotas;
    if (!quotas) return null;

    return {
      dailyUsed: Number(quotas.api_requests_daily?.used || 0),
      dailyAllowed: Number(quotas.api_requests_daily?.allowed || 500),
      monthlyUsed: Number(quotas.api_requests_monthly?.used || 0),
      monthlyAllowed: Number(quotas.api_requests_monthly?.allowed || 15500),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function lookupThreat(
  rawHash: string,
  options?: { virustotalApiKey?: string },
): Promise<ThreatReport> {
  const hash = validateSha256(rawHash);

  // VirusTotal anahtarı varsa: SADECE bu durumda VirusTotal ve kota sorgusu çalışır
  if (options?.virustotalApiKey) {
    const [vtReport, quota] = await Promise.all([
      queryVirusTotal(hash, options.virustotalApiKey),
      fetchVirusTotalQuota(options.virustotalApiKey),
    ]);
    if (vtReport) {
      if (quota) vtReport.quota = quota;
      return vtReport;
    }
  }

  // Varsayılan açık servis CIRCL Hashlookup (Kota sorgusu ve API Key gerektirmez)
  const circlReport = await queryCircl(hash);
  if (circlReport) return circlReport;

  throw new ApiError(
    503,
    'THREAT_SERVICE_UNAVAILABLE',
    'Tehdit istihbaratı servisine ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
  );
}
