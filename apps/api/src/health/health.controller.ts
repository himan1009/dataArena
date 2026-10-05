import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';

import { HealthService } from './health.service';

@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /** Lightweight liveness — no database (fast wake-up ping). */
  @Get('live')
  @HttpCode(HttpStatus.OK)
  getLive() {
    return this.healthService.getLiveStatus();
  }

  /**
   * Readiness — includes a real PostgreSQL query so idle DB connections stay warm.
   * Use this URL for keep-alive cron (every ~8 minutes).
   */
  @Get('ready')
  async getReady(@Res({ passthrough: true }) res: Response) {
    const payload = await this.healthService.getReadyStatus();

    if (payload.status !== 'ok') {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }

    return payload;
  }

  /** Alias of ready for monitors that only allow `/health`. */
  @Get()
  async getHealth(@Res({ passthrough: true }) res: Response) {
    return this.getReady(res);
  }
}
