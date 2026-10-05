import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ShortsController } from './shorts.controller';
import { ShortsService } from './shorts.service';

@Module({
  imports: [AuthModule],
  controllers: [ShortsController],
  providers: [ShortsService, RolesGuard],
})
export class ShortsModule {}
