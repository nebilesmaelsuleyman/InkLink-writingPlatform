import { Module } from '@nestjs/common';
import {MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true, load:[databaseConfig]}), DatabaseModule, 
    UsersModule],
  controllers: [],
  providers: []
})
export class AppModule {}
