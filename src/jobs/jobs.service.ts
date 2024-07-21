// src/job/job.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { JobDocument, Jobs } from './jobs.models';
import { STATUS } from 'src/types';
import { Token } from 'src/token/token.model';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Jobs.name) private jobModel: Model<JobDocument>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async getAccessToken() {
    const tokenInfo = await this.tokenModel.find({});
    return tokenInfo[0]?.access_token;
  }

  async createJob() {
    const newJob = new this.jobModel({
      createdAt: new Date(),
      status: STATUS.PENDING,
    });
    await newJob.save();
    this.processJob(newJob._id as string);
    return newJob;
  }

  async getJobs(): Promise<Jobs[]> {
    return this.jobModel.find().exec();
  }

  async getJobById(id: string): Promise<Jobs> {
    return this.jobModel.findById(id).exec();
  }

  private async processJob(jobId: string): Promise<void> {
    const delay = Math.floor(Math.random() * 11) * 5000 + 5000;
    const token = await this.getAccessToken();
    setTimeout(async () => {
      try {
        const response = await axios.get(
          'https://api.unsplash.com/photos/random?query=food',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const cleanedData = {
          id: response.data.id,
          slug: response.data.slug,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          width: response.data.width,
          height: response.data.height,
          color: response.data.color,
          description: response.data.description,
          alt_description: response.data.alt_description,
          urls: response.data.urls,
          user: response.data.user,
          tags: response.data.tags.map((item) => ({
            title: item.title,
          })),
        };
        await this.jobModel.findByIdAndUpdate(jobId, {
          status: STATUS.RESOLVED,
          result: cleanedData,
          resolvedAt: new Date(),
        });
      } catch (error) {
        await this.jobModel.findByIdAndUpdate(jobId, {
          status: STATUS.FAILED,
          resolvedAt: new Date(),
        });
      }
    }, delay);
  }
}
