import Fastify from "fastify";
import getAllRoutes from "./routes/routes.ts";
import onRequest from "./hooks/onRequest.ts";
const fastify = Fastify({
  logger: true,
});

for (const { route, prefix } of getAllRoutes()) {
  await fastify.register(route, { prefix: prefix ?? null });
}

fastify.addHook("onRequest", onRequest);

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
