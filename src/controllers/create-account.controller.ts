import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.serivce";
import * as z from "zod";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateAccountBoddySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBoddySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        "User with same e-mail address alrady exists"
      );
    }

    const hashPassword = await hash(password, 8);
    console.log("hashpassword", hashPassword);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
  }
}
