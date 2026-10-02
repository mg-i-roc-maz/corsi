// UN SOLO "database" condiviso da tutto il monolite.
// Catalogo e ordini leggono e scrivono gli stessi array: è comodo,
// ma è proprio questo accoppiamento che renderà difficile separarli.

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
}

export interface OrderLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  lines: OrderLine[];
  totalCents: number;
  createdAt: string;
}

export const db = {
  products: [] as Product[],
  orders: [] as Order[],
  counters: { product: 1, order: 1 },
};

export function seed(): void {
  db.products = [
    { id: "p-1", name: "Tastiera meccanica", description: "Switch rossi, layout italiano", priceCents: 8990, stock: 12 },
    { id: "p-2", name: "Mouse wireless", description: "Sensore 16000 DPI", priceCents: 3990, stock: 30 },
    { id: "p-3", name: "Monitor 27\"", description: "QHD, 144 Hz", priceCents: 27900, stock: 5 },
  ];
  db.orders = [];
  db.counters = { product: 4, order: 1 };
}
