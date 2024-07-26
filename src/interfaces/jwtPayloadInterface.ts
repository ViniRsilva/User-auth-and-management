import { JwtPayload } from "jsonwebtoken";
export interface jwtPayloadInterface extends JwtPayload {
  id: string;
}
