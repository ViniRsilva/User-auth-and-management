import { FastifyReply } from "fastify";
import { removePathParamsUrl, removeQueryParamsUrl } from "../utils/removeParamsUrl.ts";
import { Params } from "../interfaces/routes.interfaces.ts";
import { getPublicRoutes } from "../routes/routes.ts";
import { verifyJwt } from "../utils/jwt.ts";
import { FastifyRequestCustom } from "../interfaces/customFastifyRequest.ts";
import logRequest from "./logRequest.ts";

export default async function onRequest(req: FastifyRequestCustom, reply: FastifyReply) {
  let { url } = req;
  const { params } = req as Params;
  const { query } = req as Params;

  url = removePathParamsUrl(url, params);
  url = removeQueryParamsUrl(url, query);

  const publicRoutes = getPublicRoutes();
  if (publicRoutes.includes(url)) {
    await logRequest(req, url);
    return;
  }

  const [barrer, token] = req.headers["authorization"]?.split(" ") || [];
  if (!barrer || !token) {
    reply.status(401).send({ error: true, message: "Token de autenticação não encontrado!" });
    return;
  }

  const { auth, jwtPayLoad } = verifyJwt(token);
  if (!auth) {
    return reply.status(401).send({
      error: true,
      message: "Token inválido!",
      data: null,
    });
  } else {
    req.idUser = jwtPayLoad?.id;
    await logRequest(req, url);
  }
}
