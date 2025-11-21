import { Injectable, NestMiddleware } from '@nestjs/common';
import { ParamsService } from './params.service';
import * as check from 'vkminiapps-params-checker';
import * as telegramCheck from 'tgwa-params-checker';
import { UserDataDto } from 'src/dto/user-data.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ParamsMiddleware implements NestMiddleware {
  constructor(private readonly paramsService: ParamsService) {}

  async use(req: any, res: any, next: () => void) {
    const authError = () =>
      res.status(401).json({
        response: false,
        statusCode: 401,
        errorCode: 0,
      });

    try {
      if (!req.headers.authorization && !req._parsedUrl.query)
        return authError();

      const params =
        req?.headers?.authorization?.slice(7) || req._parsedUrl.query || '';

      const isFromVK = params.includes('vk_user_id=');

      let platform = isFromVK ? 'vk' : 'tg';

      let user_id;

      try {
        user_id = isFromVK
          ? +params.split('vk_user_id=')[1].split('&')[0]
          : JSON.parse(
              decodeURIComponent(req.headers.authorization)
                .split('user=')[1]
                .split('&')[0],
            );
      } catch {}

      switch (platform) {
        case 'vk':
          if (
            !check(
              params,
              process.env.APP_SECRET_KEY,
              +process.env.AUTHORIZATION_LIFETIME || 0,
            )
          )
            return authError();
          break;

        case 'tg':
          let isAuth = false;
          if (
            telegramCheck(
              params,
              process.env.TELEGRAM_BOT_KEY,
              +process.env.AUTHORIZATION_LIFETIME || 0,
            )
          )
            isAuth = true;

          try {
            const jwtAuth: any = jwt.verify(params, process.env.JWT_SECRET);

            user_id = jwtAuth.id;
            platform = 'external';

            isAuth = true;
          } catch {}

          if (!isAuth) return authError();
          break;
      }

      const user: UserDataDto = await this.paramsService.getUser(
        user_id,
        isFromVK,
        platform,
      );

      req.headers = {
        ...req.headers,
        user,
      };

      next();
    } catch (e) {
      console.log(e);
      return authError();
    }
  }
}
