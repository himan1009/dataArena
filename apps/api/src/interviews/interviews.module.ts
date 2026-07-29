import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

@Module({
  imports: [AuthModule],
  controllers: [InterviewsController],
  providers: [InterviewsService, RolesGuard],
})
export class InterviewsModule {}
