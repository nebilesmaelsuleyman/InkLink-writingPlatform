import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schema/user.schema';
import { CreateUserInput } from '../users/validators/create-user.zod';

type LoginInput = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: CreateUserInput) {
    try {
      const hashedPassword = await bcrypt.hash(input.password, 12);
      const user = await this.userModel.create({
        ...input,
        email: input.email.toLowerCase().trim(),
        password: hashedPassword,
      });

      const safeUser = user.toObject();
      delete safeUser.password;
      return this.buildAuthResponse(safeUser);
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(input: LoginInput) {
    const user = await this.userModel
      .findOne({ email: input.email.toLowerCase().trim() })
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const safeUser = user.toObject();
    delete safeUser.password;
    return this.buildAuthResponse(safeUser);
  }

  private async buildAuthResponse(user: { _id: unknown; email: string }) {
    const payload = {
      sub: String(user._id),
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
