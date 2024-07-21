import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { Token, TokenSchema } from './token.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [TokenService]
  })
export class TokenModule {}
