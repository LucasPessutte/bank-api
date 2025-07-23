import { IsUUID, IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0)
  balance?: number;

  @IsOptional()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0)
  creditLimit?: number;
}

export class CreateAccountResponseDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsString()
  number: string;

  @IsOptional()
  balance?: number;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;
}
