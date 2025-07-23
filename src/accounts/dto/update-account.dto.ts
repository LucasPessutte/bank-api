import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  balance?: number;

  @IsOptional()
  @IsNotEmpty()
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
