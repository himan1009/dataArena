import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { KeepAliveService } from './keepalive.service';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [HealthService, KeepAliveService],
})
export class HealthModule {}
