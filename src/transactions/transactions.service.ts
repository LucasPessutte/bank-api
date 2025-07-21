import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTransactionDto,
  CreateTransactionResponseDto,
} from './dto/create-transaction.dto';
import { AuthenticatedUser } from 'src/auth/auth.controller';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTransaction(
    dto: CreateTransactionDto,
    user: AuthenticatedUser,
  ): Promise<CreateTransactionResponseDto> {
    const { accountId, amount, type } = dto;

    const account = await this.prismaService.account.findUnique({
      where: { id: accountId, userId: user.sub },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const currentBalance = account.balance.toNumber();
    const creditLimit = account.creditLimit.toNumber();

    if (type === 'WITHDRAW' && currentBalance + creditLimit < amount) {
      await this.prismaService.transaction.create({
        data: {
          accountId,
          amount,
          type,
          status: 'FAILED',
          errorMessage: 'Insufficient balance and credit limit exceeded',
        },
      });
      throw new BadRequestException(
        'Insufficient balance and credit limit exceeded',
      );
    }

    const newBalance =
      type === 'DEPOSIT' ? currentBalance + amount : currentBalance - amount;

    try {
      const [, transaction] = await this.prismaService.$transaction([
        this.prismaService.account.update({
          where: { id: accountId },
          data: { balance: newBalance },
        }),
        this.prismaService.transaction.create({
          data: {
            accountId,
            amount,
            type,
            status: 'SUCCESS',
          },
        }),
      ]);

      return {
        id: transaction.id,
        accountId,
        type,
        amount,
        createdAt: transaction.createdAt,
      };
    } catch (error) {
      await this.prismaService.transaction.create({
        data: {
          accountId,
          amount,
          type,
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      throw new BadRequestException('Transaction failed: ' + error.message);
    }
  }

  async findAllByAccountId(
    accountId: string,
    user: AuthenticatedUser,
  ): Promise<TransactionDto[]> {
    const accountExists = await this.prismaService.account.findFirst({
      where: { id: accountId, userId: user.sub },
    });

    if (!accountExists) {
      throw new NotFoundException('Account not found');
    }

    const response = (await this.prismaService.transaction.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    })) as unknown as TransactionDto[];

    return response;
  }
}
