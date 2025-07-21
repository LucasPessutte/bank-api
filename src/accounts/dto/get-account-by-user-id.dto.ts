import { IsNumber, IsString } from 'class-validator';

export class GetAccountByUserIdResponseDto {
  @IsString()
  userName: string;

  @IsString()
  userDocument: string;

  @IsString()
  number: string;

  @IsNumber()
  balance: number;

  @IsNumber()
  creditLimit: number;
}
