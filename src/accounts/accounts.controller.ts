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

@UseGuards(ApiKeyGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<CreateAccountResponseDto> {
    return this.accountsService.create(createAccountDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') accountId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<void> {
    return this.accountsService.update(accountId, updateAccountDto);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  getAccountByUserId(
    @Param('userId') userId: string,
  ): Promise<GetAccountByUserIdResponseDto> {
    return this.accountsService.getAccountByUserId(userId);
  }
}
