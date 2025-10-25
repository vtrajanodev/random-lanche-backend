import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.serivce";
import z from "zod";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtStrategy)
export class ListQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 4;

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = questions.length;

    return { questions, total };
  }
}
