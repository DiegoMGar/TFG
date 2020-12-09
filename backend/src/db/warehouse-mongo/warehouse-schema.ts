import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WarehouseDocument = Warehouse & Document;

export enum WarehouseProductPriority {
  LOW,
  MEDIUM,
  HIGH,
}

export class WarehouseMetadata {
  @Prop() product: string;
  @Prop() priority: WarehouseProductPriority;
  @Prop() stock: number;
  @Prop() blocked: boolean;
}

export class WarehouseProduct {
  @Prop() product: string;
  @Prop() stock: number;
  @Prop() expiry: Date;
}

@Schema()
export class Warehouse {
  @Prop() headquarter: string;
  @Prop() products: WarehouseProduct[];
  @Prop() metadata: WarehouseMetadata[];
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
