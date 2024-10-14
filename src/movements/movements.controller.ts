import { BadRequestException, Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ApiTags, ApiBody, ApiOperation, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { ValidationResponseDto } from './dto/validation-response.dto';
import { Response } from 'express';

@ApiTags('movements')
@Controller('movements')
export class MovementsController {
    constructor(private readonly movementsService: MovementsService) {}

    @Post('validation')
    @ApiOperation({
        summary: 'Validate movements',
        description: 'Validates a list of movements and balances to ensure they are consistent with each other.',
      })
    @ApiOkResponse({ description: 'Data successfully processed (validation succeeded or failed)', type: ValidationResponseDto })
    @ApiBadRequestResponse({ description: 'Bad request (malformed body)' })
    @ApiBody({ type: ValidateMovementsDto })
    validate(@Res() res: Response, @Body() validateMovementsDto: ValidateMovementsDto): ValidationResponseDto | BadRequestException {
        const result = this.movementsService.validateMovements(validateMovementsDto);
        res.status(HttpStatus.OK).json(result);
        return result;
    }
}