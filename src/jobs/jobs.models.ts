import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STATUS } from 'src/types';

export type JobDocument = Jobs & Document;

@Schema()
export class Jobs {
  @Prop()
  status: String;
  enum: STATUS;
  default: STATUS.PENDING;

  @Prop({ type: Object })
  result: Record<string, any>;

  @Prop()
  createdAt: Date;

  @Prop()
  resolvedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Jobs);
