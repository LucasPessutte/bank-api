import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  CreateTransactionResponseDto,
} from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { AuthenticatedUser } from 'src/auth/auth.controller';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { TransactionDto } from './dto/transaction.dto';

@ApiTags('Transactions')
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criação de transação (depósito ou saque)',
    description: 'Cria uma nova transação bancária para a conta informada.',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Dados necessários para criar uma transação.',
    examples: {
      'Create Transaction': {
        summary: 'Exemplo de criação de transação',
        value: {
          accountId: 'd60b472e-1588-4b86-bf5f-8ce2dbf81272',
          type: 'DEPOSIT',
          amount: 100.0,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso.',
    type: CreateTransactionResponseDto,
    example: {
      id: '130b472e-1588-4b86-bf5f-8ce2dbf81272',
      accountId: 'd60b472e-1588-4b86-bf5f-8ce2dbf81272',
      type: 'DEPOSIT',
      amount: 100.0,
      createdAt: '2023-10-01T12:00:00Z',
    },
  })
  async create(
    @Body() data: CreateTransactionDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CreateTransactionResponseDto> {
    return this.transactionsService.createTransaction(data, user);
  }

  @Get('account/:accountId')
  @ApiOperation({
    summary: 'Listar transações da conta',
    description: 'Retorna todas as transações de uma conta bancária.',
  })
  @ApiParam({ name: 'accountId', description: 'ID da conta bancária' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso.',
    type: TransactionDto,
    isArray: true,
    example: [
      {
        id: '130b472e-1588-4b86-bf5f-8ce2dbf81272',
        accountId: 'd60b472e-1588-4b86-bf5f-8ce2dbf81272',
        type: 'WITHDRAW',
        amount: 100.0,
        createdAt: new Date().toISOString(),
      },
      {
        id: '130b472e-1588-4b86-bf5f-8ce2dbf81273',
        accountId: 'd60b472e-1588-4b86-bf5f-8ce2dbf81273',
        type: 'DEPOSIT',
        amount: 200.0,
        createdAt: new Date().toISOString(),
      },
    ],
  })
  async getTransactionsByAccountId(
    @Param('accountId') accountId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<TransactionDto[]> {
    return this.transactionsService.findAllByAccountId(accountId, user);
  }
}
