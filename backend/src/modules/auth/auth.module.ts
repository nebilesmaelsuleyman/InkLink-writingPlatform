import { Injectable, Module, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserDocument, UserSchema } from '../users/schema/user.schema';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-change-me',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel.findById(payload.sub).select('-password').lean().exec();
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
