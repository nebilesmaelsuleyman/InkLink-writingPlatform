import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateUserSchema, CreateUserInput } from './validators/create-user.zod';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() body: CreateUserInput) {
    return this.usersService.create(body);
  }
}
