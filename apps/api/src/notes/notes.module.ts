import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [AuthModule],
  controllers: [NotesController],
  providers: [NotesService, RolesGuard],
})
export class NotesModule {}
