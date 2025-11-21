import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthData, AuthDataCode } from './dto/auth-data.dto';
import { AuthBody, RefreshBody } from './dto/auth-body.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Модуль авторизации')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @ApiOperation({
    summary: 'Авторизация',
  })
  @ApiResponse({
    status: 200,
    type: AuthData,
  })
  @ApiResponse({
    status: 201,
    type: AuthDataCode,
  })
  @Throttle(1, 2)
  async signin(
    @Body() body: AuthBody,
    @Req() req: any,
  ): Promise<AuthData | AuthDataCode> {
    return await this.authService.signin(body, req);
  }

  @Post('/refresh')
  @ApiOperation({
    summary: 'Обновление токена',
  })
  @ApiResponse({
    status: 200,
    type: AuthData,
  })
  @Throttle(1, 2)
  async refresh(@Body() body: RefreshBody): Promise<AuthData> {
    return await this.authService.refresh(body);
  }
}
