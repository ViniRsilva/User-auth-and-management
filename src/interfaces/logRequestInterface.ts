export interface logRequest {
  id: string;
  route: string;
  method: string;
  body: string | null;
  params: string | null;
  createdAt: Date;
  idUser: string | null;
}
