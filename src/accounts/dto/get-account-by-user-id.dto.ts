import { IsNumber, IsString, IsUUID } from 'class-validator';

export class GetAccountByUserIdResponseDto {
  @IsUUID()
  id: string;

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
