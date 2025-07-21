import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException('This email is used');
    }

    const hashedPassword = await hash(password, 10);

    await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return {
      message: 'Usuário criado',
      user: {
        name,
        email,
      },
    };
  }
}
