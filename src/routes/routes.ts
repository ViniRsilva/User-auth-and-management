import USERS_ROUTES from "./USERS_ROUTES.ts";
const routes = [
  {
    route: USERS_ROUTES,
    prefix: "/v1/users",
  },
];

export default function getAllRoutes() {
  return routes;
}
