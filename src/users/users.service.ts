import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  private validateCPF(cpf: string) {
    let sum = 0;
    let rest;

    const strCPF = cpf.replace(/[^\d]/g, '');

    if (strCPF.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(strCPF)) return false;

    for (let i = 1; i <= 9; i++)
      sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

    rest = (sum * 10) % 11;

    if (rest == 10 || rest == 11) rest = 0;

    if (rest != parseInt(strCPF.substring(9, 10))) return false;

    sum = 0;

    for (let i = 1; i <= 10; i++)
      sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

    rest = (sum * 10) % 11;

    if (rest == 10 || rest == 11) rest = 0;

    if (rest != parseInt(strCPF.substring(10, 11))) return false;

    return true;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, document } = createUserDto;

    const validateCpf = this.validateCPF(document);

    if (!validateCpf) {
      throw new BadRequestException('The cpf is invalid.');
    }
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ document }, { email }],
      },
    });

    if (user) {
      throw new BadRequestException('Email or document already exists');
    }

    const hashedPassword = await hash(password, 10);

    const createdUser = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        document,
      },
    });
    return {
      id: createdUser.id,
      email,
      name,
      document,
    };
  }
}
