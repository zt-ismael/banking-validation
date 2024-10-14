import { Test, TestingModule } from '@nestjs/testing';
import { MovementsService } from './movements.service';
import { ValidationErrorType } from './dto/validation-response.dto';

describe('MovementsService', () => {
  let service: MovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementsService],
    }).compile();

    service = module.get<MovementsService>(MovementsService);
  });

  it('should validate correct movements and balances', () => {
    const movements = [
      { id: 1, date: new Date('2023-01-01'), label: 'Achat', amount: 100 },
      { id: 2, date: new Date('2023-01-05'), label: 'Vente', amount: 200 },
    ];
    const balances = [
      { date: new Date('2023-01-31'), balance: 300 },
    ];

    const result = service.validateMovements({ movements, balances });

    expect(result).toEqual({ success: true, message: 'Accepted' });
  });

  it('should fail validation for incorrect balance', () => {
    const movements = [
      { id: 1, date: new Date('2023-01-01'), label: 'Achat', amount: 100 },
    ];
    const balances = [
      { date: new Date('2023-01-31'), balance: 200 },
    ];

    const result = service.validateMovements({ movements, balances });

    expect(result).toMatchObject({
      success: false,
      message: expect.stringContaining('Validation failed'),
      reasons: expect.arrayContaining([
        expect.objectContaining({
        type: ValidationErrorType.BalanceMismatch,
        calculated_balance: 100,
        expected_balance: 200,
        missing_amount: 100,
        }),
      ]),
    });
  });

  it('should fail validation for duplicate transaction, but correct amount (if no duplicate)', () => {
    const movements = [
      { id: 1, date: new Date('2023-01-10'), label: 'Achat', amount: 100 },
      { id: 1, date: new Date('2023-01-10'), label: 'Achat', amount: 100 },
      { id: 1, date: new Date('2023-01-10'), label: 'Achat', amount: 100 },
    ];
    const balances = [
      { date: new Date('2023-01-31'), balance: 100 },
    ];

    const result = service.validateMovements({ movements, balances });

    expect(result).toMatchObject({
      success: false,
      message: expect.stringContaining('Validation failed'),
      reasons: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.DuplicateTransaction,
          date: movements[0].date,
          duplicate_operation_id: '1',
          occurences: 3,
          suggested_fixes: expect.stringContaining('Please remove the duplicate transaction'),
        }),
      ]),
    });
  });


});
