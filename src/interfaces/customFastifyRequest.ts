import { FastifyRequest } from "fastify";

export interface FastifyRequestCustom extends FastifyRequest {
  idUser?: string;
}
