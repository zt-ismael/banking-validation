import { Test, TestingModule } from '@nestjs/testing';
import { MovementsService } from './movements.service';

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

    expect(result).toEqual({
      success: false,
      message: "Validation failed",
      reasons: [{
        type: 'balance_mismatch',
        message: expect.stringContaining('Balance mismatch'),
      }],
    });
  });
});
