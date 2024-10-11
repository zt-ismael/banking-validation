import { Injectable } from '@nestjs/common';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ValidationResponseDto } from './dto/validation-response.dto';

@Injectable()
export class MovementsService {
    validateMovements(dto: ValidateMovementsDto): ValidationResponseDto {
        const { movements, balances } = dto;
        const validationErrors: any[] = [];

        // Validate each balance
        for (const balance of balances) {
            const filteredMovements = movements.filter(m => m.date <= balance.date);
            const calculatedBalance = filteredMovements.reduce((sum, mov) => sum + mov.amount, 0);

            if (calculatedBalance !== balance.balance) {
                validationErrors.push({
                    type: 'balance_mismatch',
                    message: `Balance mismatch on ${balance.date}. Expected: ${balance.balance}, Got: ${calculatedBalance}`,
                });
            }
        }

        // Check for duplicate transactions
        const transactionIds = new Set();
        for (const movement of movements) {
            if (transactionIds.has(movement.id)) {
                validationErrors.push({
                    type: 'duplicate_transaction',
                    message: `Duplicate transaction with id ${movement.id}`,
                });
            } else {
                transactionIds.add(movement.id);
            }
        }

        if (validationErrors.length > 0) {
            return new ValidationResponseDto(false, 'Validation failed', validationErrors);
        }
        return new ValidationResponseDto(true, 'Accepted');
    }
}