import { Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.serivce";

@Controller("/sessions")
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  //   @HttpCode(201)
  //   @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle() {
    const token = this.jwt.sign({
      sub: "user-id",
    });

    return token;
  }
}
