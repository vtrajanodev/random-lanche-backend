import { Module } from "@nestjs/common";

import { PrismaService } from "./prisma/prisma.serivce";

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
