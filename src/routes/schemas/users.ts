const usersSchemas = {
  "/users": {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" },
      nivel: { type: "number" },
    },
    required: ["name", "email", "password", "nivel"],
    additionalProperties: false,
  } as const,
  "/login": {
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
    required: ["email", "password"],
    additionalProperties: false,
  } as const,
  "/users/:id": {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
  } as const,
};

export default usersSchemas;
