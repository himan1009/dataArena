import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { HealthModule } from './health/health.module';
import { InterviewsModule } from './interviews/interviews.module';
import { NotesModule } from './notes/notes.module';
import { PracticeModule } from './practice/practice.module';
import { ShortsModule } from './shorts/shorts.module';
import { PrismaModule } from './prisma/prisma.module';
import { StandardsModule } from './standards/standards.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    NotesModule,
    InterviewsModule,
    PracticeModule,
    ShortsModule,
    FeedbackModule,
    StandardsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
