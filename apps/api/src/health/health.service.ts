import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_DB_TIMEOUT_MS = 8_000;

export type HealthCheckResult = {
  ok: boolean;
  latencyMs: number;
  error?: string;
};

@Injectable()
export class HealthService {
  private readonly startedAt = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  getLiveStatus() {
    return {
      status: 'ok' as const,
      service: 'dataarena-api',
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase(): Promise<HealthCheckResult> {
    const timeoutMs = this.getDbTimeoutMs();
    const start = Date.now();

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        this.prisma.$queryRaw`SELECT 1`,
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error('database_health_timeout')),
            timeoutMs,
          );
        }),
      ]);

      return {
        ok: true,
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'database_unavailable';

      return {
        ok: false,
        latencyMs: Date.now() - start,
        error:
          message === 'database_health_timeout'
            ? 'database_timeout'
            : 'database_unavailable',
      };
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }

  async getReadyStatus() {
    const live = this.getLiveStatus();
    const database = await this.checkDatabase();

    return {
      ...live,
      status: database.ok ? ('ok' as const) : ('degraded' as const),
      checks: {
        database,
      },
    };
  }

  private getDbTimeoutMs() {
    const raw = process.env.HEALTH_CHECK_DB_TIMEOUT_MS;
    if (!raw) {
      return DEFAULT_DB_TIMEOUT_MS;
    }

    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed < 1_000 || parsed > 30_000) {
      return DEFAULT_DB_TIMEOUT_MS;
    }

    return parsed;
  }
}
