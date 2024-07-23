import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import usersSchemas from "./schemas/users.ts";
import { createUser } from "../interfaces/user.interface.ts";
import UserActions from "../usecase/users/UserActions.ts";

export default function USERS_ROUTES(fastify: FastifyInstance, options: any) {
  const userActions = new UserActions();
  //Authentication
  fastify.post("/login", (req, reply) => {});

  //CRUD Users
  fastify.post<{ Body: createUser }>("/users", { schema: { body: usersSchemas["/users"] } }, async (req, reply) => {
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

  fastify.get("/users", (req, reply) => {});
  fastify.get("/users/:id", (req, reply) => {});
  fastify.put("/users/:id", (req, reply) => {});
  fastify.delete("/users/:id", (req, reply) => {});

  //Private Rotes
  fastify.get("users/report", (req, reply) => {});
  fastify.get("users/requests", (req, reply) => {});
}
