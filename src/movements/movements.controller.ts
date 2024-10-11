import { Body, Controller, Post } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { ValidateMovementsDto } from './dto/validate-movements.dto';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post('validation')
  validate(@Body() validateMovementsDto: ValidateMovementsDto) {
    const result = this.movementsService.validateMovements(validateMovementsDto);
    if (result.valid) {
      return { message: result.message };
    }
    return { message: 'Validation failed', reasons: result.reasons };
  }
}
