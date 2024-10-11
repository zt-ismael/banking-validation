import { ValidationPipeOptions } from '@nestjs/common';

export const validationPipeConfig: ValidationPipeOptions = {
  whitelist: true,             // Remove properties not in the DTO
  forbidNonWhitelisted: true,  // Throw error if extra fields are sent
  transform: true,             // Automatically transform payloads to DTO instances
};