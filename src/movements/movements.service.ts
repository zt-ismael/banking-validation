import { Injectable } from '@nestjs/common';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ValidationResponseDto } from './dto/validation-response.dto';

@Injectable()
export class MovementsService {
    validateMovements(dto: ValidateMovementsDto): ValidationResponseDto {
        const { movements, balances } = dto;
        const validationErrors: any[] = [];

        // Filter duplicate transactions
        const uniqueIds = new Set<number>();
        const filteredMovements = movements.filter((movement) => {
            if (uniqueIds.has(movement.id)) {
                validationErrors.push({
                    type: 'duplicate_transaction',
                    message: `Duplicate transaction with id ${movement.id}`,
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
                    type: 'balance_mismatch',
                    message: `Balance mismatch on ${balance.date}. Expected: ${balance.balance}, Got: ${calculatedBalance}`,
                });
            }
        }

        if (validationErrors.length > 0) {
            return new ValidationResponseDto(false, 'Validation failed', validationErrors);
        }
        return new ValidationResponseDto(true, 'Accepted');
    }
}
