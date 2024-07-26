import { FastifyPluginAsync } from "fastify";
export interface route {
  route: FastifyPluginAsync;
  prefix: string;
  public: Array<string>;
}

export interface Params {
  [key: string]: any;
}
