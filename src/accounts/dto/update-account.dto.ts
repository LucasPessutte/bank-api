import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsNotEmpty()
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
