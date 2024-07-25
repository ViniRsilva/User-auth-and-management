export interface user {
  id: string;
  name: string;
  email: string;
  password: string;
  nivel: Number;
  createAt: Date;
}

export interface createUser {
  name: string;
  email: string;
  password: string;
  nivel: number;
}
export interface userLogin {
  email: string;
  password: string;
}

export interface IdParams {
  id: string;
}
