import Fastify from "fastify";
import getAllRoutes from "./routes/routes.ts";

const fastify = Fastify({
  logger: true,
});

export default function bootstrap() {
  try {
    fastify.listen({ port: 3000 }, () => {
      console.log("Servidor rodando");
      console.log("Servidor");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

const router = getAllRoutes();

for (const { route, prefix } of router) {
  fastify.register(route, { prefix: prefix ?? null });
}
