import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response-dto';
import { BadRequestDto } from 'src/common/dtos/bad-request.dto';
import { UnauthorizedRequestDto } from 'src/common/dtos/unauthorizated-request.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthValidateResponseDto } from './dto/auth-validate-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

export interface AuthenticatedUser {
  sub: string;
  name?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login with JWT token generation',
    description: 'Authenticates a user and returns a JWT access token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid input data',
    type: BadRequestDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials',
    type: UnauthorizedRequestDto,
  })
  async login(@Body() authLoginDto: AuthLoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate-token')
  @ApiBearerAuth()
  validateToken(@Req() req: any): AuthValidateResponseDto {
    return {
      sub: req.user.sub,
      name: req.user.name,
    };
  }
}
