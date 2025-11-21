import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    if (!req.headers?.user?.is_admin)
      return res.status(401).json({
        response: false,
        statusCode: 401,
        errorCode: 0,
      });

    next();
  }
}
