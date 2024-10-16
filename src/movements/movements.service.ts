import { Injectable } from '@nestjs/common';
import { MovementDto, ValidateMovementsDto } from './dto/validate-movements.dto';
import { ValidationError, ValidationErrorType, ValidationResponseDto } from './dto/validation-response.dto';
import { MappedBody } from './interfaces/movements-request.interface';

@Injectable()
export class MovementsService {
    
    validateMovements(body: ValidateMovementsDto) {
        const validationErrors: ValidationError[] = [];

        // Validate each balance with movements
        for (const balance of body.balances) {
            const calculatedBalance = body.movements
                .filter(mov => mov.date <= balance.date)
                .reduce((sum, mov) => sum + mov.amount, 0);

            if (calculatedBalance !== balance.balance) {
                validationErrors.push({
                    type: ValidationErrorType.BalanceMismatch,
                    date: balance.date,
                    suggested_fixes: 'Please check the movements and balances again',
                    expected_balance: balance.balance,
                    calculated_balance: calculatedBalance,
                    missing_amount: balance.balance - calculatedBalance,
                    
                });
            }
        }

        if (validationErrors.length > 0) {
            return new ValidationResponseDto(false, 'Validation failed', validationErrors);
        }
        return new ValidationResponseDto(true, 'Accepted');
    }
}
