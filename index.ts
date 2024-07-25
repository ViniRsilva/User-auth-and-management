import bootstrap from "./src/server.ts";
import Fastify from "fastify";

// const fastify = Fastify({
//   logger: true,
// });

// fastify.listen({
//   port: 3000,
// });

console.log("servidor rodando");

bootstrap();
