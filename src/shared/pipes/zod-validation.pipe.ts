import { PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ValidationFailedException } from '../exceptions/http.exceptions';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new ValidationFailedException(JSON.parse(error)[0].message);
    }
  }
}
