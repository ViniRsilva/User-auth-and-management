import { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginAsync } from "fastify";
import usersSchemas from "./schemas/users.ts";
import { createUser, userLogin, IdParams } from "../interfaces/user.interface.ts";
import UserActions from "../usecase/users/UserActions.ts";
import { validPassword } from "../utils/passwords.ts";
import { signJwt } from "../utils/jwt.ts";

const USERS_ROUTES: FastifyPluginAsync = async (fastify, options) => {
  const userActions = new UserActions();
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
  // fastify.get("users/report", (req, reply) => {});
  // fastify.get("users/requests", (req, reply) => {});
};
export default USERS_ROUTES;
