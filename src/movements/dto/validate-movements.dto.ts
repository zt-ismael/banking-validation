import { IsDate, IsInt, ValidateNested, ArrayNotEmpty, IsDefined, IsArray, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a movement in the banking system.
 */
export class MovementDto {
  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsInt()
  id: number;

  @ApiProperty({ required: true, type: Date })
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  label: string;

  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsNumber()
  amount: number;
}

export class BalanceDto {
  @ApiProperty({ required: true, type: Date })
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsInt()
  balance: number;
}

export class ValidateMovementsDto {
  @ApiProperty({ type: [MovementDto], required: true })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MovementDto)
  movements: MovementDto[];

  @ApiProperty({ type: [BalanceDto], required: true })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BalanceDto)
  balances: BalanceDto[];
}
