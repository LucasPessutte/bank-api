import { IsUUID, IsEnum, IsNumber, Min } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsUUID()
  accountId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0.01)
  amount: number;
}

export class CreateTransactionResponseDto {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  createdAt: Date;
}
