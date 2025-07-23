import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiKeyGuard } from 'src/common/guards/api-key-guards';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
@UseGuards(ApiKeyGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new bank user',
    description:
      'Creates a new bank user with the provided data. Returns the created user.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Bank user successfully created. Returns the created user data.',
    example: {
      id: 'd60b472e-1588-4b86-bf5f-8ce2dbf81272',
      name: 'John Doe',
      email: 'email@email.com',
      document: '12345678900',
    },
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Data required to create a new bank user',
    examples: {
      'Create User': {
        summary: 'Example of creating a user',
        value: {
          name: 'John Doe',
          email: 'teste@email.com',
          document: '12345678900',
        },
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
