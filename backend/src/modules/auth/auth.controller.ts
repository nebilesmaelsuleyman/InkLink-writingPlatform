import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateUserInput, CreateUserSchema } from '../users/validators/create-user.zod';
import { AuthService } from './auth.service';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginInput = z.infer<typeof LoginSchema>;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  register(@Body() body: CreateUserInput) {
    return this.authService.register(body);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: LoginInput) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() request: Request) {
    return request.user;
  }
}
