import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_INTERVAL_MINUTES = 8;
const MIN_INTERVAL_MINUTES = 3;
const MAX_INTERVAL_MINUTES = 14;
const REQUEST_TIMEOUT_MS = 90_000;
const FIRST_PING_DELAY_MS = 15_000;

@Injectable()
export class KeepAliveService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(KeepAliveService.name);
  private timer: ReturnType<typeof setInterval> | null = null;
  private firstPingTimer: ReturnType<typeof setTimeout> | null = null;
  private targetUrl: string | null = null;
  private pingInFlight = false;

  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    if (!this.isEnabled()) {
      return;
    }

    const url = this.resolveTargetUrl();
    if (!url) {
      this.logger.warn(
        'KEEPALIVE_ENABLED is true but no URL (set KEEPALIVE_URL or deploy on Render for RENDER_EXTERNAL_URL)',
      );
      return;
    }

    this.targetUrl = url;
    const intervalMs = this.getIntervalMs();
    this.logger.log(
      `Self keep-alive every ${intervalMs / 60_000} min → ${url} (first ping in ${FIRST_PING_DELAY_MS / 1000}s)`,
    );

    this.firstPingTimer = setTimeout(() => {
      void this.ping();
    }, FIRST_PING_DELAY_MS);

    this.timer = setInterval(() => {
      void this.ping();
    }, intervalMs);
  }

  onModuleDestroy() {
    if (this.firstPingTimer) {
      clearTimeout(this.firstPingTimer);
      this.firstPingTimer = null;
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private isEnabled() {
    return this.configService.get<string>('KEEPALIVE_ENABLED') === 'true';
  }

  private resolveTargetUrl(): string | null {
    const explicit = this.configService.get<string>('KEEPALIVE_URL')?.trim();
    if (explicit) {
      return explicit;
    }

    const renderExternal = this.configService
      .get<string>('RENDER_EXTERNAL_URL')
      ?.trim()
      .replace(/\/$/, '');

    if (!renderExternal) {
      return null;
    }

    return `${renderExternal}/api/v1/health/ready`;
  }

  private getIntervalMs() {
    const raw = this.configService.get<string>('KEEPALIVE_INTERVAL_MINUTES');
    const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_INTERVAL_MINUTES;
    const minutes = Number.isFinite(parsed)
      ? Math.min(
          MAX_INTERVAL_MINUTES,
          Math.max(MIN_INTERVAL_MINUTES, parsed),
        )
      : DEFAULT_INTERVAL_MINUTES;

    return minutes * 60_000;
  }

  private async ping() {
    const url = this.targetUrl;
    if (!url || this.pingInFlight) {
      return;
    }

    this.pingInFlight = true;

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        this.logger.warn(`Keep-alive ping failed: HTTP ${response.status}`);
        return;
      }

      this.logger.debug('Keep-alive ping OK');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown_error';
      this.logger.warn(`Keep-alive ping error: ${message}`);
    } finally {
      this.pingInFlight = false;
    }
  }
}
