import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default function users(fastify: FastifyInstance, options: any) {
  fastify.get("/users", async (req: FastifyRequest, reply: FastifyReply) => {
    console.log("hello word");
  });
}
