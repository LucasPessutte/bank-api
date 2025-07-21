import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAccountDto,
  CreateAccountResponseDto,
} from './dto/create-account-dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { GetAccountByUserIdResponseDto } from './dto/get-account-by-user-id.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  private generateRandomAccountNumber(): string {
    const base = Math.floor(10000000 + Math.random() * 90000000).toString();
    return `${base}`;
  }
  async create(data: CreateAccountDto): Promise<CreateAccountResponseDto> {
    const { userId, balance, creditLimit } = data;

    const accountByUser = await this.prismaService.account.findFirst({
      where: {
        userId,
      },
    });

    if (accountByUser) {
      throw new BadRequestException('This user already has an account');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('This user does not exists');
    }

    const account = await this.prismaService.account.create({
      data: {
        userId,
        number: this.generateRandomAccountNumber(),
        balance: balance || 0,
        creditLimit: creditLimit || 0,
      },
    });

    return {
      userId,
      number: account.number,
      balance: account.balance.toNumber(),
      creditLimit: account.creditLimit.toNumber(),
    };
  }

  async update(accountId: string, data: UpdateAccountDto): Promise<void> {
    const account = await this.prismaService.account.findFirst({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      throw new NotFoundException('This account not found');
    }

    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(sanitizedData).length === 0) {
      return;
    }

    await this.prismaService.account.update({
      data: sanitizedData,
      where: {
        id: accountId,
      },
    });
  }

  async getAccountByUserId(
    userId: string,
  ): Promise<GetAccountByUserIdResponseDto> {
    const account = await this.prismaService.account.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      throw new NotFoundException('This account not found');
    }

    return {
      userName: account.user.name,
      userDocument: account.user.document,
      number: account.number,
      balance: account.balance.toNumber(),
      creditLimit: account.creditLimit.toNumber(),
    };
  }
}
