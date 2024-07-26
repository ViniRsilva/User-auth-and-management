import { Params } from "../interfaces/routes.interfaces.ts";

export function removePathParamsUrl(url: string, params: Params) {
  const paramsLenght = Object.keys(params).length;
  if (paramsLenght == 0) return url;

  for (const key of Object.keys(params)) {
    url = url.replace(params[key], "");
  }

  return url;
}

export function removeQueryParamsUrl(url: string, query: Params) {
  const queryLenght = Object.keys(query).length;
  if (queryLenght == 0) return url;

  url = url.replace(/\?.*$/, "");

  return url;
}
