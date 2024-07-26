import jsonwebtoken from "jsonwebtoken";
import { jwtPayloadInterface } from "../interfaces/jwtPayloadInterface.ts";

export function verifyJwt(token: string) {
  try {
    const JTW_SECRET = process.env.JWT_SECRET;
    if (!JTW_SECRET) throw new Error("JWT_SECRET environment variable is not set");

    const decoded = jsonwebtoken.verify(token, JTW_SECRET) as jwtPayloadInterface;
    return { auth: true, jwtPayLoad: decoded };
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.includes("invalid signature") || e.message.includes("jwt expired")) return { auth: false, idUser: null };
      else throw e;
    } else throw new Error("An unknown error occurred");
  }
}

export function signJwt(id: string) {
  try {
    const JTW_SECRET = process.env.JWT_SECRET;
    if (!JTW_SECRET) throw new Error("JWT_SECRET environment variable is not set");
    const token = jsonwebtoken.sign({ id }, JTW_SECRET, { expiresIn: "1h" });
    return token;
  } catch (e) {
    console.log(e);
    if (e instanceof Error) throw e;
    throw new Error("Error signing JWT");
  }
}
