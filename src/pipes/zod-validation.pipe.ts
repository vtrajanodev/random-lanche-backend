import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodError, ZodType } from "zod";
import * as z from "zod";

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          errors: z.flattenError(error),
        });
      }
      throw error;
    }
  }
}
