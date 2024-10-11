import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class MovementDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  label: string;

  @IsInt()
  amount: number;
}

export class BalanceDto {
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsInt()
  balance: number;
}

export class ValidateMovementsDto {
  movements: MovementDto[];
  balances: BalanceDto[];
}
