import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ExternalMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    if (
      req.headers?.user?.platform === 'vk' ||
      req.headers?.user?.platform === 'tg'
    )
      return res.status(401).json({
        response: false,
        statusCode: 401,
        errorCode: 0,
      });

    next();
  }
}
