import PrismaClient from "../database/prismaClient.ts";
import { createUser, user } from "../interfaces/user.interface.ts";
export default class UserRepositoryPrisma {
  async create(user: createUser): Promise<user> {
    const { name, email, password, nivel } = user;
    const result = await PrismaClient.user.create({
      data: {
        name,
        email,
        password,
        nivel,
      },
    });
    console.log("🚀 ~ UserActionsPrisma ~ create ~ result:", result);
    return result;
  }

  async getAll(): Promise<user[]> {
    return await PrismaClient.user.findMany();
  }

  async getById(id: string): Promise<user | null> {
    return await PrismaClient.user.findUnique({ where: { id } });
  }

  async getByEmail(email: string): Promise<user | null> {
    return await PrismaClient.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, newData: createUser): Promise<user | null> {
    return await PrismaClient.user.update({
      where: { id },
      data: {
        ...newData,
      },
    });
  }

  async delete(id: string): Promise<user | null> {
    return await PrismaClient.user.delete({
      where: { id },
    });
  }
}
