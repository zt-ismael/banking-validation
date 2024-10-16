import { Injectable, CanActivate, ExecutionContext, UnprocessableEntityException, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MappedBody, MovementesRequest } from '../interfaces/movements-request.interface';
import { ValidationErrorType, ValidationResponseDto } from '../dto/validation-response.dto';

@Injectable()
export class DuplicatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: MovementesRequest = context.switchToHttp().getRequest();

    // Ensure that middleware 'body-mapper' has been triggered
    if (!request._mappedBody) {
      // TODO : new Error ? really ? no better option ?
      throw new Error('DuplicatedGuard requires movements/body-mapper.middleware to be used');
    }

    // Handle the case when duplicates are found
    const duplicatesMovements = [...request._mappedBody.movements?.values()].filter(movement => movement.occurences > 1)
    if ( duplicatesMovements.length ) {
      throw new HttpException(
        new ValidationResponseDto(false, 'Validation failed', [
          ...duplicatesMovements.map(({ id, date, occurences }) => ({
            type: ValidationErrorType.DuplicateTransaction,
            date,
            suggested_fixes: `Please remove the duplicate transaction (${occurences} occurences)`,
            duplicate_operation_id: id,
            occurences,
          })),
        ])
      , 444)
    }

    return true; // Allow the request to proceed if no duplicates are found
  }
}