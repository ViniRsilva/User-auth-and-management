import UserRepositoryPrisma from "../../repositories/UserRepositoryPrisma.ts";
import { createUser, user } from "../../interfaces/user.interface.ts";
import { createHashPassword } from "../../utils/passwords.ts";

export default class UserActions {
  #userRepository = new UserRepositoryPrisma();

  async create({ name, email, password, nivel }: createUser): Promise<user> {
    try {
      const existUser = await this.#userRepository.getByEmail(email);
      if (existUser) throw new Error(`User ${name} already exists`);
      password = await createHashPassword(password);
      return await this.#userRepository.create({ name, email, password, nivel });
    } catch (e) {
      console.log(e);
      if (e instanceof Error) throw new Error(e.message);
      throw new Error("Internal server error");
    }
  }

  async getAll(): Promise<user[]> {
    return await this.#userRepository.getAll();
  }

  async getById(id: string | undefined): Promise<user | null> {
    if (id === undefined) return null;
    return await this.#userRepository.getById(id);
  }

  async getByEmail(email: string): Promise<user | null> {
    return await this.#userRepository.getByEmail(email);
  }

  async update(id: string, data: createUser): Promise<user | null> {
    const user = await this.#userRepository.getById(id);
    if (!user) return null;
    return await this.#userRepository.update(id, data);
  }

  async delete(id: string): Promise<user | null> {
    const user = await this.#userRepository.getById(id);
    if (!user) return null;
    return await this.#userRepository.delete(id);
  }
}
