import { Test, TestingModule } from '@nestjs/testing';
import { MovementsService } from './movements.service';
import { ValidationErrorType } from './dto/validation-response.dto';
import { BalanceDto, MovementDto } from './dto/validate-movements.dto';

describe('MovementsService', () => {
  let service: MovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementsService],
    }).compile();

    service = module.get<MovementsService>(MovementsService);
  });

  it('should validate correct movements and balances', () => {
    const validData = {
      movements: [
        { id: 1, date: new Date('2023-01-01'), label: 'Achat', amount: 100 },
        { id: 2, date: new Date('2023-01-05'), label: 'Vente', amount: 200 },
      ],
      balances: [
        { date: new Date('2023-01-31'), balance: 300 },
      ]
    }

    const result = service.validateMovements(validData);

    expect(result).toEqual({ success: true, message: 'Accepted' });
  });

  it('should fail validation for incorrect balance', () => {
    const invalidData = {
      movements: [
        { id: 1, date: new Date('2023-01-01'), label: 'Achat', amount: 100 },
      ],
      balances: [
        { date: new Date('2023-01-31'), balance: 300 },
      ]
    }

    const result = service.validateMovements(invalidData);

    expect(result).toMatchObject({
      success: false,
      message: expect.stringContaining('Validation failed'),
      reasons: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.BalanceMismatch,
          date: new Date('2023-01-31'),
          calculated_balance: 100,
          expected_balance: 300,
          missing_amount: 200,
        }),
      ]),
    });
  });
});
