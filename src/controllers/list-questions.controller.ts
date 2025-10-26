import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.serivce";
import z from "zod";
import { JwtAuthGuard } from "@/auth/jwt-auth-guard";

const pageQueryParamSchema = z.object({
  limit: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1)),
  offset: z
    .string()
    .optional()
    .default("0")
    .transform(Number)
    .pipe(z.number().int().min(0)),
});

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class ListQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: PageQueryParamSchema) {
    const { limit, offset } = query;

    const questions = await this.prisma.question.findMany({
      take: limit,
      skip: (offset - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await this.prisma.question.count();

    return {
      total,
      limit,
      offset,
      count: questions.length,
      questions,
    };
  }
}
