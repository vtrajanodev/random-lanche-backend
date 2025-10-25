import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/jwt-auth-guard";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.serivce";
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
