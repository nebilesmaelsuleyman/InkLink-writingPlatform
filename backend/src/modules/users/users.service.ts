import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserInput } from './validators/create-user.zod';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(data: CreateUserInput) {
    try {
      const user = new this.userModel(data);
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
}
