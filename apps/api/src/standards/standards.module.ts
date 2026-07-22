import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StandardsController } from './standards.controller';
import { StandardsService } from './standards.service';

@Module({
  imports: [AuthModule],
  controllers: [StandardsController],
  providers: [StandardsService, RolesGuard],
})
export class StandardsModule {}
