// Validazione del corpo di POST /orders: almeno una riga, quantità intere e positive.
export const createOrderSchema = {
  type: "object",
  required: ["customerEmail", "items"],
  additionalProperties: false,
  properties: {
    customerEmail: { type: "string", format: "email" },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["productId", "quantity"],
        additionalProperties: false,
        properties: {
          productId: { type: "string", minLength: 1 },
          quantity: { type: "integer", minimum: 1 },
        },
      },
    },
  },
} as const;
