import { FastifyInstance, FastifyPluginAsync } from "fastify";
import usersSchemas from "./schemas/users.ts";
import { createUser, userLogin, IdParams } from "../interfaces/user.interface.ts";
import UserActions from "../usecase/users/UserActions.ts";
import LogRequestActions from "../usecase/logRequest/logRequestActions.ts";
import { validPassword } from "../utils/passwords.ts";
import { signJwt } from "../utils/jwt.ts";
import { FastifyRequestCustom } from "../interfaces/customFastifyRequest.ts";
import { parse } from "json2csv";

const USERS_ROUTES: FastifyPluginAsync<{}> = async function (fastify: FastifyInstance, options) {
  const userActions = new UserActions();
  const logRequestActions = new LogRequestActions();
  //Authentication
  fastify.post<{ Body: userLogin }>("/login", { schema: { body: usersSchemas["/login"] } }, async (req, reply) => {
    try {
      const { email, password } = req.body;
      const user = await userActions.getByEmail(email);
      const userHashPassword = user?.password;

      if (!user || !(await validPassword(password, userHashPassword))) {
        return reply.status(401).send({
          error: true,
          message: "Email ou senha inválidos!",
          data: null,
        });
      }

      const tokenJwt = signJwt(user.id);
      return {
        error: false,
        message: "Login realizado com sucesso!",
        data: { token: tokenJwt },
      };
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return reply.status(500).send({
          error: true,
          message: e.message,
          errorObj: { ...e },
          data: null,
        });
      }
    }
  });
  //
  //CRUD Users
  fastify.post<{ Body: createUser }>("/", { schema: { body: usersSchemas["/users"] } }, async (req, reply) => {
    try {
      const { name, email, password, nivel } = req.body;
      const user = await userActions.create({ name, email, password, nivel });
      return reply.status(201).send({
        error: false,
        message: "Usuário criado com sucesso!",
        data: user,
      });
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return reply.status(500).send({
          error: true,
          massage: e.message,
          errorObj: { ...e },
          data: null,
        });
      }
    }
  });

  fastify.get("/", async (req, reply) => {
    try {
      const users = await userActions.getAll();
      return {
        error: false,
        message: "Usuários carregados com sucesso!",
        data: users,
      };
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return reply.status(500).send({
          error: true,
          message: e.message,
          errorObj: { ...e },
          data: null,
        });
      }
    }
  });

  fastify.get<{ Params: IdParams }>("/:id", { schema: { params: usersSchemas["/users/:id"] } }, async (req, reply) => {
    try {
      const { id } = req.params;
      const user = await userActions.getById(id);
      if (!user) {
        return reply.status(404).send({
          error: true,
          message: "Usuário não encontrado!",
          data: null,
        });
      }

      return {
        error: false,
        message: "Usuario encontrado!",
        data: user,
      };
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return reply.status(500).send({
          error: true,
          message: e.message,
          errorObj: { ...e },
          data: null,
        });
      }
    }
  });

  fastify.put<{ Params: IdParams; Body: createUser }>("/:id", { schema: { params: usersSchemas["/users/:id"] } }, async (req, reply) => {
    try {
      const { id } = req.params;
      const { name, email, password, nivel } = req.body;
      const isUpdated = await userActions.update(id, { name, email, password, nivel });

      if (!isUpdated) {
        return reply.status(404).send({
          error: true,
          message: "Usuário não encontrado!",
          data: null,
        });
      }
      return {
        error: false,
        message: "Usuário atualizado com sucesso!",
        data: isUpdated,
      };
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return reply.status(500).send({
          error: true,
          message: e.message,
          errorObj: { ...e },
          data: null,
        });
      }
    }
  });
  fastify.delete<{ Params: IdParams }>("/:id", { schema: { params: usersSchemas["/users/:id"] } }, async (req, reply) => {
    try {
      const { id } = req.params;
      const isDeleted = await userActions.delete(id);

      if (!isDeleted) {
        return reply.status(404).send({
          error: true,
          message: "Usuário não encontrado!",
          data: null,
        });
      }

      return {
        error: false,
        message: "Usuario deletado com sucesso !",
        data: isDeleted,
      };
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return reply.status(500).send({
          error: true,
          message: e.message,
          erroObj: { ...e },
          data: null,
        });
      }
    }
  });

  // //Private Rotes
  fastify.get("/report", async (req: FastifyRequestCustom, reply) => {
    try {
      const { idUser } = req;
      const user = await userActions.getById(idUser);
      const nivel = user?.nivel;

      // Only admin can generate report.
      if (nivel && nivel < 4) {
        return reply.status(403).send({
          error: true,
          message: "Você não possui permissão para gerar relatório!",
          data: null,
        });
      }

      const users = await userActions.getAll();
      const csv = parse(users, { fields: ["id", "name", "email"] });
      reply.header("Content-type", "text/csv");
      reply.header("Content-Disposition", "attachment; filename= users.csv");
      reply.send(csv);
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return reply.status(500).send({
          error: true,
          message: e.message,
          errorObj: { ...e },
          data: null,
        });
      }
    }
  });

  fastify.get("/requests", async (req: FastifyRequestCustom, reply) => {
    try {
      const { idUser } = req;
      const user = await userActions.getById(idUser);
      const nivel = user?.nivel;
      if (nivel && nivel < 4) {
        return reply.status(403).send({
          error: true,
          message: "Você não possui permissão para gerar solicitações!",
          data: null,
        });
      }

      const logs = await logRequestActions.getAll();
      const csv = parse(logs);
      reply.header("Content-type", "text/csv");
      reply.header("Content-disposition", "attachment; filename=logs.csv");
      return reply.send(csv);
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return reply.status(500).send({
          error: true,
          message: e.message,
          errorObj: { ...e },
          data: null,
        });
      }
    }
  });
};
export default USERS_ROUTES;
