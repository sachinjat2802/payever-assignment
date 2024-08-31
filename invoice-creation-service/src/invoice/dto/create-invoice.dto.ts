import {
  IsString,
  IsNumber,
  IsDate,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsString()
  readonly sku: string;

  @IsNumber()
  readonly qt: number;
}

export class CreateInvoiceDto {
  @IsString()
  readonly customer: string;

  @IsNumber()
  readonly amount: number;

  @IsString()
  readonly reference: string;

  @IsDate()
  @Type(() => Date)
  readonly date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @ArrayMinSize(1)
  readonly items: InvoiceItemDto[];
}
