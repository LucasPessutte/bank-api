import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload-interface';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './dto/auth-response-dto';
import { AuthLoginDto } from './dto/auth-login.dto';

const ERROR_CREDENTIALS_INCORRECT = 'Credentials are incorrect';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(credentials: AuthLoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_CREDENTIALS_INCORRECT);
    }

    const isValid = await compare(credentials.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException(ERROR_CREDENTIALS_INCORRECT);
    }

    const paylod: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      name: user.name || undefined,
    };

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN') || 3600; // Default to 1 hour if not set;
    const accessToken = this.jwtService.sign(paylod, {
      expiresIn: expiresIn,
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: user.id,
        name: user.name || undefined,
      },
    };
  }
}
