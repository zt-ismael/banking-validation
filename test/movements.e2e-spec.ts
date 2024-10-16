import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bodyParser from 'body-parser';
import { AppModule } from '../src/app.module';
import { validationPipeConfig } from '../src/validationPipeConfig';  // Import shared config (shared with src)
import { ValidationErrorType } from '../src/movements/dto/validation-response.dto';
import { DuplicatedGuard } from '../src/movements/guards/duplicates.guard';

describe('MovementsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {

    // Create the testing module as you would for production
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],  // Use the actual AppModule
    }).compile();

    app = moduleFixture.createNestApplication();

    // Ensure the body parser is set up
    app.use(bodyParser.json()); // For parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
    
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig)); // Enable global validation pipe with shared config

    // Apply the actual guard globally in the test
    app.useGlobalGuards(app.get(DuplicatedGuard));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 for successful validation', async () => {
    const validRequest = {
      movements: [
        { id: 1, date: new Date('2023-01-05'), label: 'Achat', amount: 100 },
        { id: 2, date: new Date('2023-01-05'), label: 'Vente', amount: 200 },
      ],
      balances: [
        { date: new Date('2023-01-31'), balance: 300 },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/movements/validation')
      .send(validRequest)
      .expect(HttpStatus.OK)

    expect(response.body).toEqual({
      success: true,
      message: 'Accepted',
    });
  });

  it('should return 200 for failed validation due to missing movements', async () => {
    const invalidRequest = {
      movements: [
        { id: 1, date: new Date('2023-01-01'), label: 'Achat', amount: 100 },
      ],
      balances: [
        { date: new Date('2023-01-31'), balance: 300 },
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

  it('should fail (return 444) validation for duplicate movement', async () => {
    const invalidRequest = {
      movements: [
        { id: 1, date: new Date('2023-01-01'), label: 'Achat', amount: 100 },
        { id: 1, date: new Date('2023-01-01'), label: 'Achat', amount: 100 },
      ],
      balances: [
        { date: new Date('2023-01-31'), balance: 200 },
      ],
    };
  
    const response = await request(app.getHttpServer())
      .post('/movements/validation')
      .send(invalidRequest)
      .expect(444);
  
    expect(response.body).toEqual({
      success: false,
      message: expect.stringContaining('Validation failed'),
      reasons: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.DuplicateTransaction,
          suggested_fixes:  expect.stringContaining('Please remove the duplicate transaction'),
          duplicate_operation_id: 1,
          occurences: 2,
        })
      ]),
    });
  });

  it('should return 400 Bad Request for missing required fields', async () => {
    const invalidRequestMissingFields = {
      movements: [
        { id: 1, date: new Date('2023-01-01'), label: 'Achat' }, // Missing amount
      ],
      balances: [
        { date: new Date('2023-01-31'), balance: 300 },
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
