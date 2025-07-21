import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  CreateTransactionResponseDto,
} from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { AuthenticatedUser } from 'src/auth/auth.controller';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { TransactionDto } from './dto/transaction.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() data: CreateTransactionDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CreateTransactionResponseDto> {
    return this.transactionsService.createTransaction(data, user);
  }

  @Get('account/:accountId')
  async getTransactionsByAccountId(
    @Param(':accountId') accountId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<TransactionDto[]> {
    return this.transactionsService.findAllByAccountId(accountId, user);
  }
}
