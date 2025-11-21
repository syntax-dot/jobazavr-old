import { Injectable, NestMiddleware } from '@nestjs/common';
import { ParamsService } from './params.service';
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

      let isAuth = false;
      let user_id;

      try {
        const jwtAuth: any = jwt.verify(params, process.env.JWT_SECRET);

        user_id = jwtAuth.id;

        isAuth = true;
      } catch {}

      if (!isAuth) return authError();

      const user: UserDataDto = await this.paramsService.getUser(user_id);

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
