import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

export default function bootstrap() {
  try {
    fastify.listen({ host: "localhost", port: 3333 }, () => {
      console.log("Servidor rodando");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
