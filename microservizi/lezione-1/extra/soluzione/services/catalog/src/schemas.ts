// JSON Schema usati da Fastify per validare il corpo delle richieste.
// Se il body non rispetta lo schema, Fastify risponde da solo 400 Bad Request.

export const productInputSchema = {
  type: "object",
  required: ["name", "priceCents", "stock"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 },
    description: { type: "string", maxLength: 500, default: "" },
    priceCents: { type: "integer", minimum: 0 },
    stock: { type: "integer", minimum: 0 },
  },
} as const;

export const idParamSchema = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string" } },
} as const;

export const listQuerySchema = {
  type: "object",
  properties: {
    q: { type: "string" },
    sort: { type: "string", enum: ["name", "-name", "price", "-price"] },
    limit: { type: "integer", minimum: 1, maximum: 50, default: 20 },
    offset: { type: "integer", minimum: 0, default: 0 },
  },
} as const;

export const productPatchSchema = {
  ...productInputSchema,
  required: [],
  minProperties: 1,
  properties: {
    ...productInputSchema.properties,
    description: { type: "string", maxLength: 500 },
  },
} as const;
