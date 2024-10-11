import { Injectable } from '@nestjs/common';
import { ValidateMovementsDto } from './dto/validate-movements.dto';

@Injectable()
export class MovementsService {
  validateMovements(dto: ValidateMovementsDto) {
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

    if (validationErrors.length > 0) {
      return {
        valid: false,
        reasons: validationErrors,
      };
    }

    return {
      valid: true,
      message: 'Accepted',
    };
  }
}
