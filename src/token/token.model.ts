import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type JobDocument = Token & Document;

@Schema()
export class Token {
  @Prop()
  access_token: String;

  @Prop()
  refresh_token: String;

  @Prop()
  token_type: String;

  @Prop()
  scope: String;

  @Prop()
  user_id: String;

  @Prop()
  created_at: String;

  @Prop()
  username: String;

  @Prop()
  clientId: String;

  @Prop()
  clientSecret: String;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
