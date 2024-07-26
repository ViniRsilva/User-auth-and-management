import USERS_ROUTES from "./USERS_ROUTES.ts";
import { route } from "./../interfaces/routes.interfaces.ts";
const routes = [
  {
    route: USERS_ROUTES,
    prefix: "/v1/users",
    public: ["/v1/users/login", "/v1/users", "/v1/users/"],
  },
];

export function getPublicRoutes(): string[] {
  const publicRoutes = routes.map((item: route) => {
    return item.public;
  });

  return publicRoutes.flat();
}

export default function getAllRoutes(): route[] {
  return routes;
}
