import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload-interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  user: JwtPayload;
}
