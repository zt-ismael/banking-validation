import { Test, TestingModule } from '@nestjs/testing';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';

describe('MovementsController', () => {
  let controller: MovementsController;
  let service: MovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementsController],
      providers: [MovementsService], // Ensure MovementsService is provided
    }).compile();

    controller = module.get<MovementsController>(MovementsController);
    service = module.get<MovementsService>(MovementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
