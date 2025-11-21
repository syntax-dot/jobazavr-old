import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class InternalMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    if (
      (req?.headers?.authorization?.slice(7) || '',
      req?.headers?.authorization?.slice(7) !== process.env.INTERNAL_KEY)
    )
      return res.status(401).json({
        response: false,
        statusCode: 401,
        errorCode: 0,
      });

    next();
  }
}
