import { Request } from 'express';
import { BalanceDto, MovementDto } from '../dto/validate-movements.dto';


export type MovementsMapped = Map<string, MovementDto & { occurences: number }>
export type BalancesMapped = Map<string, BalanceDto & { occurences: number }>
export type MappedBody = {
  movements?: MovementsMapped,
  balances?: BalancesMapped
}

export interface MovementesRequest extends Request {
    _mappedBody?: MappedBody;
  }