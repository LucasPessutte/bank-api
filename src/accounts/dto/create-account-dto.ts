import { IsUUID, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;
}

export class CreateAccountResponseDto {
  @IsUUID()
  userId: string;

  @IsString()
  number: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;
}
