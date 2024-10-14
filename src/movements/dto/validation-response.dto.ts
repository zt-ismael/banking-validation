import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MovementDto } from './validate-movements.dto';

export enum ValidationErrorType {
    BalanceMismatch = 'balance_mismatch',
    DuplicateTransaction = 'duplicate_transaction',
}


export class ValidationError {
    @ApiProperty({ description: 'The type of validation error', enum: ValidationErrorType })
    type: ValidationErrorType;
  
    @ApiProperty({ description: 'The date of the balance mismatch or duplicate transaction', type: Date })
    date: Date;
  
    @ApiProperty({ description: 'Suggested fixes for the balance mismatch', type: String })
    suggested_fixes: string;
  
    @ApiPropertyOptional({ description: `The expected balance (for "${ValidationErrorType.BalanceMismatch}" error type ONLY)`, type: Number })
    expected_balance?: number;
  
    @ApiPropertyOptional({ description: `The calculated balance (for "${ValidationErrorType.BalanceMismatch}" error type ONLY)`, type: Number })
    calculated_balance?: number;
  
    @ApiPropertyOptional({ description: `The missing amount (for "${ValidationErrorType.BalanceMismatch}" error type ONLY)`, type: Number })
    missing_amount?: number;
  
    @ApiPropertyOptional({ description: `The duplicate operation ID (for "${ValidationErrorType.DuplicateTransaction}" error type ONLY)`, type: String })
    duplicate_operation_id?: string;
  
    @ApiPropertyOptional({ description: `Number of duplicate operation occurences (for "${ValidationErrorType.DuplicateTransaction}" error type ONLY)`, type: Number })
    occurences?: number;
  }

export class ValidationResponseDto {
    @ApiProperty({ description: 'Indicates whether the validation was successful or not', type: Boolean })
    success: boolean;

    @ApiProperty({ description: 'A message describing the result of the validation', type: String })
    message: string;

    @ApiProperty({ description: 'An optional array of reasons for the validation failure', type: [ValidationError] })
    reasons?: ValidationError[];

    constructor(success: boolean, message: string, reasons?: ValidationError[]) {
        this.success = success;
        this.message = message;
        this.reasons = reasons;
    }
}