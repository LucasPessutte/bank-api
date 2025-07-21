import { IsUUID, IsEnum, IsNumber } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsUUID()
  accountId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  amount: number;
}

export class CreateTransactionResponseDto {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  createdAt: Date;
}
