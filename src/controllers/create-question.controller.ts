import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  async handle(@Req() request: Request) {
    console.log(request.user);
    return "ok";
  }
}
