import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard"; // ⚠️ Use o guard, não a strategy
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.serivce";
import z from "zod";

const questionIdQueryParamSchema = z.uuid();

const paramValidatorPipe = new ZodValidationPipe(questionIdQueryParamSchema);
type QuestionIdQueryParamSchema = z.infer<typeof questionIdQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class DeleteQuestionController {
  constructor(private prisma: PrismaService) {}

  @Delete(":questionId")
  async handle(
    @Param("questionId", paramValidatorPipe)
    questionId: QuestionIdQueryParamSchema
  ) {
    const questionToDelete = this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!questionToDelete) return { message: "Pergunta não encontrada" };

    await this.prisma.question.delete({ where: { id: questionId } });

    return { message: "Pergunta deletada com sucesso" };
  }
}
