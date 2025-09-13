import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.serivce";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService
  ) {}

  @Get("/hello-teste")
  index(): string {
    return this.appService.getHello();
  }

  @Post("/hello")
  store(): string {
    return "teste";
  }

  @Post("teste")
  async teste() {
    return await this.prisma.user.findMany();
  }
}
