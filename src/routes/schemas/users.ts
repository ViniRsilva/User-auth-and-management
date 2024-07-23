const usersSchemas = {
  "/users": {
    type: "object",
    properties: {
      nome: { type: String },
      email: { type: String, format: "email" },
      password: { type: String },
      nivel: { type: Number },
    },
    required: ["nome", "email", "password", "nivel"],
    additionalProperties: false,
  },
};

export default usersSchemas;
