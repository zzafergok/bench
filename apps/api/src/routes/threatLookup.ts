import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { ApiError, sendApiError } from '../errors.js';
import { lookupThreat } from '../threatLookup.js';

interface ThreatQuery {
  hash?: string;
  apiKey?: string;
}

interface ThreatBody {
  hash?: string;
  apiKey?: string;
}

export function registerThreatLookupRoute(
  app: FastifyInstance,
  config: AppConfig,
): void {
  // GET /api/crypto/threat-lookup?hash=...
  app.get<{ Querystring: ThreatQuery }>(
    '/api/crypto/threat-lookup',
    async (request, reply) => {
      const hash = request.query.hash;
      if (!hash) {
        return sendApiError(
          reply,
          new ApiError(
            400,
            'MISSING_HASH',
            'Sorgulanacak SHA-256 hash değeri gereklidir.',
          ),
        );
      }

      const apiKey = request.query.apiKey || config.VIRUSTOTAL_API_KEY;
      try {
        const report = await lookupThreat(hash, { virustotalApiKey: apiKey });
        return reply.send(report);
      } catch (error) {
        if (error instanceof ApiError) return sendApiError(reply, error);
        return sendApiError(
          reply,
          new ApiError(
            500,
            'THREAT_LOOKUP_ERROR',
            'Tehdit sorgusu yapılamadı.',
          ),
        );
      }
    },
  );

  // POST /api/crypto/threat-lookup { hash: string, apiKey?: string }
  app.post<{ Body: ThreatBody }>(
    '/api/crypto/threat-lookup',
    async (request, reply) => {
      const hash = request.body?.hash;
      if (!hash) {
        return sendApiError(
          reply,
          new ApiError(
            400,
            'MISSING_HASH',
            'Sorgulanacak SHA-256 hash değeri gereklidir.',
          ),
        );
      }

      const apiKey = request.body?.apiKey || config.VIRUSTOTAL_API_KEY;
      try {
        const report = await lookupThreat(hash, { virustotalApiKey: apiKey });
        return reply.send(report);
      } catch (error) {
        if (error instanceof ApiError) return sendApiError(reply, error);
        return sendApiError(
          reply,
          new ApiError(
            500,
            'THREAT_LOOKUP_ERROR',
            'Tehdit sorgusu yapılamadı.',
          ),
        );
      }
    },
  );
}
