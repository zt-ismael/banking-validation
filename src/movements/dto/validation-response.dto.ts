import { ApiProperty } from '@nestjs/swagger';


export class ValidationResponseDto {
    @ApiProperty({ description: 'Indicates whether the validation was successful or not' })
    success: boolean;

    @ApiProperty({ description: 'A message describing the result of the validation' })
    message: string;

    @ApiProperty({ description: 'An optional array of reasons for the validation failure' })
    reasons?: string[];

    constructor(success: boolean, message: string, reasons?: string[]) {
        this.success = success;
        this.message = message;
        this.reasons = reasons;
    }
}