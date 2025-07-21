import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    description: 'User ID in the bank-api system',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's external secret key",
    example: 'minha-chave-secreta-123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
