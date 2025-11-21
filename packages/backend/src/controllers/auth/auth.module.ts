import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { AuthTokens } from 'src/entities/auth-tokens.entity';
import { Codes } from 'src/entities/codes.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([Users, AuthTokens, Codes])],
})
export class AuthModule {}
