import { FastifyRequestCustom } from "../interfaces/customFastifyRequest.ts";
import PrismaClient from "../database/prismaClient.ts";

export default async function logRequest(req: FastifyRequestCustom, url: string) {
  const idUser = req.idUser;
  const log = await PrismaClient.logRequest.create({
    data: {
      route: url,
      method: req.method,
      body: JSON.stringify(req.body) || null,
      params: JSON.stringify(req.params) || null,
      idUser,
    },
  });
}
