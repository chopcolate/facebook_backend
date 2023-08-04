import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { databaseModule } from 'src/common/database/database.module';
import { usersProviders } from '../users/providers/users.providers';
require('dotenv').config({path: 'src/.env'});
@Module({
  imports: [databaseModule, UsersModule, PassportModule, JwtModule.register({
    secret: process.env.SECRETKEY,
  })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...usersProviders]
})
export class AuthModule {}
