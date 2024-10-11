import { BadRequestException, Body, Controller, HttpException, HttpStatus, Post, Req, Res, UnprocessableEntityException } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ValidationResponseDto } from './dto/validation-response.dto';
import { Request, Response } from 'express';
import { ValidationPipe } from '@nestjs/common';

@ApiTags('movements')
@Controller('movements')
export class MovementsController {
    constructor(private readonly movementsService: MovementsService) {}

    @Post('validation')
    @ApiOperation({
        summary: 'Validate movements',
        description: 'Validates a list of movements and balances to ensure they are consistent with each other.',
      })
    @ApiResponse({ status: 202, description: 'Accepted', type: ValidationResponseDto })
    @ApiResponse({ status: 422, description: 'Validation failed', type: ValidationResponseDto })
    @ApiBody({ type: ValidateMovementsDto })
    validate(@Req() req: Request, @Res() res: Response, @Body() validateMovementsDto: ValidateMovementsDto): ValidationResponseDto | BadRequestException {
        const result = this.movementsService.validateMovements(validateMovementsDto);
        
        // Return 202 for successful validation
        if (result.success) {
            res.status(HttpStatus.ACCEPTED).json(result);
            return result;
        } else {
            // Return 422 for failed validation (but valid request structure)
            throw new UnprocessableEntityException(result);
        }
    }
}