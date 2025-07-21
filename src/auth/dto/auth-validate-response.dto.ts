import { ApiProperty } from '@nestjs/swagger';

export class AuthValidateResponseDto {
  @ApiProperty({ example: 'c30fdb31-5c29-4f2c-aebb-6b65d2d4a9a7' })
  sub: string;

  @ApiProperty({ example: 'Zé das Couves' })
  name?: string;
}
