import LogRequestRepositoryPrisma from "../../repositories/LogRequestRepositoryPrisma.ts";
import { logRequest } from "../../interfaces/logRequestInterface.ts";
export default class logRequestActions {
  #logRequestRepository = new LogRequestRepositoryPrisma();

  async getAll(): Promise<logRequest[]> {
    return await this.#logRequestRepository.getAll();
  }
}
