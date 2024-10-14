import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { validationPipeConfig } from '../src/validationPipeConfig';  // Import shared config (shared with src)
import { ValidationErrorType } from '../src/movements/dto/validation-response.dto';

describe('MovementsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import the full application module for E2E testing
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig)); // Enable global validation pipe with shared config
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 for successful validation', async () => {
    const validRequest = {
      movements: [
        { id: 1, date: '2023-01-01', label: 'Achat', amount: 100 },
        { id: 2, date: '2023-01-05', label: 'Vente', amount: 200 },
      ],
      balances: [
        { date: '2023-01-31', balance: 300 },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/movements/validation')
      .send(validRequest)
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      message: 'Accepted',
    });
  });

  it('should return 200 for failed validation due to missing movements', async () => {
    const invalidRequest = {
      movements: [
        { id: 1, date: '2023-01-01', label: 'Achat', amount: 100 },
      ],
      balances: [
        { date: '2023-01-31', balance: 300 },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/movements/validation')
      .send(invalidRequest)
      .expect(200);

    expect(response.body).toEqual({
      success: false,
      message: 'Validation failed',
      reasons: expect.any(Array), // expecting reasons array for failure
    });
  });

  it('should return 200 for duplicate transactions', async () => {
    const invalidRequestWithDuplicates = {
      movements: [
        { id: 1, date: '2023-01-01', label: 'Achat', amount: 100 },
        { id: 1, date: '2023-01-01', label: 'Achat', amount: 100 }, // duplicate
        { id: 2, date: '2023-01-15', label: 'Vente', amount: -100 },
      ],
      balances: [
        { date: '2023-01-31', balance: 0 },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/movements/validation')
      .send(invalidRequestWithDuplicates)
      .expect(200);

    expect(response.body).toEqual({
      success: false,
      message: expect.stringContaining('Validation failed'),
      reasons: expect.arrayContaining([{
        type: ValidationErrorType.DuplicateTransaction,
        date: expect.any(String),
        duplicate_operation_id: '1',
        occurences: 2,
        suggested_fixes: expect.stringContaining('Please remove the duplicate transaction'),
      }])
    });
  });

  it('should fail validation for incorrect balance and duplicate movement', async () => {
    const invalidRequest = {
      movements: [
        { id: 1, date: '2023-01-01', label: 'Achat', amount: 100 },
        { id: 1, date: '2023-01-01', label: 'Achat', amount: 100 },
      ],
      balances: [
        { date: '2023-01-31', balance: 200 },
      ],
    };
  
    const response = await request(app.getHttpServer())
      .post('/movements/validation')
      .send(invalidRequest)
      .expect(200);
  
    expect(response.body).toEqual({
      success: false,
      message: expect.stringContaining('Validation failed'),
      reasons: expect.arrayContaining([
        {
          type: ValidationErrorType.DuplicateTransaction,
          date: expect.any(String),
          suggested_fixes:  expect.stringContaining('Please remove the duplicate transaction'),
          duplicate_operation_id: '1',
          occurences: 2,
        },
        {
          type: ValidationErrorType.BalanceMismatch,
          date: expect.any(String),
          suggested_fixes: "Please check the movements and balances again",
          calculated_balance: 100,
          expected_balance: 200,
          missing_amount: 100,
        },
      ]),
    });
  });

  it('should return 400 Bad Request for missing required fields', async () => {
    const invalidRequestMissingFields = {
      movements: [
        { id: 1, date: '2023-01-01', label: 'Achat' }, // Missing amount
      ],
      balances: [
        { date: '2023-01-31', balance: 300 },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/movements/validation')
      .send(invalidRequestMissingFields)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: expect.any(Array), // should list the missing fields
      error: 'Bad Request',
    });
  });
});
