import prisma from "../database/prismaClient.ts";
import { logRequest } from "../interfaces/logRequestInterface.ts";
export default class LogRequestRepositoryPrisma {
  async getAll(): Promise<logRequest[]> {
    return await prisma.logRequest.findMany();
  }
}
