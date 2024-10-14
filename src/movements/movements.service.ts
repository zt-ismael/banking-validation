import { Injectable } from '@nestjs/common';
import { MovementDto, ValidateMovementsDto } from './dto/validate-movements.dto';
import { ValidationError, ValidationErrorType, ValidationResponseDto } from './dto/validation-response.dto';

@Injectable()
export class MovementsService {

    private static _transactionsMapper(movements: MovementDto[]): Map<string, MovementDto & { occurences: number }> {
        const duplicateTransactions = new Map<string, MovementDto & { occurences: number }>();
        movements.forEach(movement => {
            const id = movement.id.toString();
            const { occurences, ...mov } = duplicateTransactions.get(id) || { occurences: 0, ...movement};
            duplicateTransactions.set(id, { occurences: occurences + 1, ...mov });
        });
        return duplicateTransactions
    }
    
    validateMovements(dto: ValidateMovementsDto): ValidationResponseDto {
        const { movements, balances } = dto;
        const validationErrors: ValidationError[] = [];

        // Map transaction IDs to their occurences and date (improving complexity)
        const transactionsOccurences = MovementsService._transactionsMapper(movements);

        // Filter duplicate transactions
        [...transactionsOccurences.entries()]
            .filter(([_, { occurences }]) => occurences > 1)
            .forEach(([id, { occurences, date }]) => {
                validationErrors.push({
                    type: ValidationErrorType.DuplicateTransaction,
                    date,
                    suggested_fixes: `Please remove the duplicate transaction (${occurences} occurences)`,
                    duplicate_operation_id: id,
                    occurences,
                });
            });

        // Validate each balance with filtered movements
        for (const balance of balances) {
            const calculatedBalance = [...transactionsOccurences.entries()]
                .filter(([_, { date }]) => date <= balance.date)
                .reduce((sum, mov) => sum + mov[1].amount, 0);

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
