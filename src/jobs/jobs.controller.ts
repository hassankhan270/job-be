// src/job/job.controller.ts
import { Controller, Get, Post, Param } from '@nestjs/common';
import { Jobs } from './jobs.models';
import { JobService } from './jobs.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(): Promise<{ id: string }> {
    const job = await this.jobService.createJob();
    return { id: job._id as string};
  }

  @Get()
  async getJobs(): Promise<Jobs[]> {
    return this.jobService.getJobs();
  }

  @Get(':id')
  async getJob(@Param('id') id: string): Promise<Jobs> {
    return this.jobService.getJobById(id);
  }
}
