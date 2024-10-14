import { Injectable } from '@nestjs/common';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ValidationError, ValidationErrorType, ValidationResponseDto } from './dto/validation-response.dto';

@Injectable()
export class MovementsService {
    validateMovements(dto: ValidateMovementsDto): ValidationResponseDto {
        const { movements, balances } = dto;
        const validationErrors: ValidationError[] = [];

        // Filter duplicate transactions
        const uniqueIds = new Set<number>();
        const filteredMovements = movements.filter((movement) => {
            if (uniqueIds.has(movement.id)) {
                // const occurences = movements.filter(m => m.id === movement.id).length;
                const existingError = validationErrors.find(e => e.duplicate_operation_id === movement.id.toString())
                if (existingError) {
                    existingError.occurences ++;
                    return false;
                }
                validationErrors.push({
                    type: ValidationErrorType.DuplicateTransaction,
                    date: movement.date,
                    suggested_fixes: `Please remove the duplicate transaction`, //  (${occurences} occurences)`,
                    duplicate_operation_id: movement.id.toString(),
                    occurences: 2, // 2 because the current movement is also counted in the occurences
                });
                return false;
            } else {
                uniqueIds.add(movement.id);
                return true;
            }
        });

        // Validate each balance with filtered movements
        for (const balance of balances) {
            const filteredBalanceMovements = filteredMovements.filter(m => m.date <= balance.date);
            const calculatedBalance = filteredBalanceMovements.reduce((sum, mov) => sum + mov.amount, 0);

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
