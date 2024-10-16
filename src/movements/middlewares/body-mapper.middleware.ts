import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { BalancesMapped, MovementsMapped, MovementesRequest } from '../interfaces/movements-request.interface';
import { BalanceDto, MovementDto } from '../dto/validate-movements.dto';

@Injectable()
export class BodyMapperMiddleware implements NestMiddleware {

  use(req: MovementesRequest, res: Response, next: NextFunction) {
    const mappedBody = {
      movements: new Map<string, MovementDto & { occurences: number }>(),
      balances: new Map<string, BalanceDto & { occurences: number }>()
    }
    req.body.movements.forEach(movement => {
      const id = movement.id.toString();
      const { occurences, ...mov } = mappedBody.movements.get(id) || { occurences: 0, ...movement };
      mappedBody.movements.set(id, { occurences: occurences + 1, ...mov });
    });
    req.body.balances.forEach(balance => {
      const date = balance.date.toString();
      const { occurences, ...bal } = mappedBody.balances.get(date) || { occurences: 0, ...balance };
      mappedBody.balances.set(date, { occurences: occurences + 1, ...bal });
    });
    req._mappedBody = mappedBody;

    next();
  }
}