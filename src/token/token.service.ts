import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './token.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async getRefreshToken() {
    try {
      const tokenUrl = 'https://unsplash.com/oauth/token';
      const tokenInfo = await this.tokenModel.find({});
      console.log(tokenInfo);
      console.log(Token.name);
      const response = await axios.post(tokenUrl, null, {
        params: {
          client_id: tokenInfo[0].clientId,
          client_secret: tokenInfo[0].clientSecret,
          refresh_token: tokenInfo[0].refresh_token,
          grant_type: 'refresh_token',
        },
      });

      console.log('******************* CRON JOB ************************');
      await this.tokenModel.findOneAndUpdate(
        { refresh_token: tokenInfo[0].refresh_token },
        {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          scope: response.data.scope,
          created_at: response.data.created_at,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
