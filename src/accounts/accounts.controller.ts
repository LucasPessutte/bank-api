import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  CreateAccountDto,
  CreateAccountResponseDto,
} from './dto/create-account-dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key-guards';
import { GetAccountByUserIdResponseDto } from './dto/get-account-by-user-id.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Accounts')
@UseGuards(ApiKeyGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criação de conta bancária',
    description: 'Abre uma nova conta bancária com dados fornecidos.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conta criada com sucesso.',
    type: CreateAccountResponseDto,
    example: {
      id: '130b472e-1588-4b86-bf5f-8ce2dbf81272',
      userId: 'd60b472e-1588-4b86-bf5f-8ce2dbf81272',
      number: '131242332',
      balance: 100.0,
      creditLimit: 2000.0,
    },
  })
  @ApiBody({
    type: CreateAccountDto,
    description: 'Dados necessários para criar uma conta bancária.',
    examples: {
      'Create Account': {
        summary: 'Exemplo de criação de conta',
        value: {
          userId: 'd60b472e-1588-4b86-bf5f-8ce2dbf81272',
          balance: 100.0,
          creditLimit: 2000.0,
        },
      },
    },
  })
  create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<CreateAccountResponseDto> {
    return this.accountsService.create(createAccountDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualização de conta bancária',
    description: 'Atualiza os dados da conta bancária informada.',
  })
  @ApiParam({ name: 'id', description: 'ID da conta bancária' })
  @ApiBody({
    type: UpdateAccountDto,
    description: 'Dados para atualizar a conta bancária.',
    examples: {
      'Update Account': {
        summary: 'Exemplo de atualização de conta',
        value: {
          balance: 150.0,
          creditLimit: 2500.0,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Conta atualizada com sucesso.',
  })
  update(
    @Param('id') accountId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<void> {
    return this.accountsService.update(accountId, updateAccountDto);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Consulta de conta por usuário',
    description: 'Retorna os dados da conta bancária de um usuário.',
  })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados da conta retornados com sucesso.',
    type: GetAccountByUserIdResponseDto,
    example: {
      id: '130b472e-1588-4b86-bf5f-8ce2dbf81272',
      userName: 'John Doe',
      userDocument: '213124322',
      number: '131242332',
      balance: 100.0,
      creditLimit: 2000.0,
    },
  })
  getAccountByUserId(
    @Param('userId') userId: string,
  ): Promise<GetAccountByUserIdResponseDto> {
    return this.accountsService.getAccountByUserId(userId);
  }
}
