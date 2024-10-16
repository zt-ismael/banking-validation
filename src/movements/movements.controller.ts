import { Body, Controller, HttpStatus, Post, Res, UseGuards, UsePipes } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ApiTags, ApiBody, ApiOperation, ApiBadRequestResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ValidationResponseDto } from './dto/validation-response.dto';
import { Response } from 'express';
import { DuplicatedGuard } from './guards/duplicates.guard';

export const _baseUrl = 'movements'

// @ApiDescriptions
@ApiTags('movements')
// @Decorators
@Controller(_baseUrl)
export class MovementsController {
    constructor(private readonly movementsService: MovementsService) {}

    // @ApiDescription
    @ApiOperation({
        summary: 'Validate movements',
        description: 'Validates a list of movements and balances to ensure they are consistent with each other.',
      })
    @ApiOkResponse({ description: 'Data successfully processed (validation succeeded or failed)', type: ValidationResponseDto })
    @ApiResponse({ status: 444, description: 'Duplicated transactions found', type: ValidationResponseDto })
    @ApiBadRequestResponse({ description: 'Bad request (malformed body)' })
    @ApiBody({ type: ValidateMovementsDto })
    // @Decorators
    @Post('validation')
    @UseGuards(DuplicatedGuard)
    validate(
        @Res() res: Response,
        @Body() body: ValidateMovementsDto, // DO NOT REMOVE : used for 'class-validation' and 'MovementsValidationPipe'
    ): ValidationResponseDto {
        const validationResult = this.movementsService.validateMovements(body)
        res.status(HttpStatus.OK).json(validationResult)
        return validationResult
    }
}