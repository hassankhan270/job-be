// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobSchema } from './jobs.models';
import { JobController } from './jobs.controller';
import { JobService } from './jobs.service';
import { Token, TokenSchema } from 'src/token/token.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jobs.name, schema: JobSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobsModule {}
