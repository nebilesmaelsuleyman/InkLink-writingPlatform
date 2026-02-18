import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

export type User = {
  id: number;
  name: string;
  email: string;
};

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  findAll(): User[] {
    return this.users;
  }

  create(dto: CreateUserDto): User {
    const user: User = { id: this.idCounter++, name: dto.name, email: dto.email };
    this.users.push(user);
    return user;
  }
}
