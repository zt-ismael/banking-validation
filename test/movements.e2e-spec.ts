import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { validationPipeConfig } from '../src/validationPipeConfig';  // Import shared config (shared with src)

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
      message: 'Validation failed',
      reasons: [{
        "message": "Duplicate transaction with id 1",
        "type": "duplicate_transaction",
      }]
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
      message: 'Validation failed',
      reasons: expect.arrayContaining([
        {
          type: 'duplicate_transaction',
          message: expect.stringContaining('Duplicate transaction'),
        },
        {
          type: 'balance_mismatch',
          message: expect.stringContaining('Balance mismatch'),
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
