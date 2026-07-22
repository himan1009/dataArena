import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WritingStandardKey } from '@prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateWritingStandardDto } from './dto/update-writing-standard.dto';
import { StandardsService } from './standards.service';

const STANDARD_KEYS = new Set<string>(Object.values(WritingStandardKey));

function parseStandardKey(key: string): WritingStandardKey {
  if (!STANDARD_KEYS.has(key)) {
    throw new BadRequestException('Invalid writing standard key');
  }

  return key as WritingStandardKey;
}

@Controller('standards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Get()
  @Roles('EDITOR', 'ADMIN')
  listStandards() {
    return this.standardsService.listStandards();
  }

  @Get(':key')
  @Roles('EDITOR', 'ADMIN')
  getStandard(@Param('key') key: string) {
    return this.standardsService.getStandard(parseStandardKey(key));
  }

  @Put(':key')
  @Roles('ADMIN')
  updateStandard(
    @Param('key') key: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateWritingStandardDto,
  ) {
    return this.standardsService.updateStandard(
      parseStandardKey(key),
      user.id,
      dto,
    );
  }
}
