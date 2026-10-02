// Archivio dei prodotti in memoria.
// Nella lezione 2 lo sostituiremo con PostgreSQL: per questo tutto l'accesso
// ai dati passa da queste funzioni e mai direttamente dalla Map.

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number; // i prezzi si salvano in centesimi: niente errori di arrotondamento
  stock: number;
}

export type ProductInput = Omit<Product, "id">;

const products = new Map<string, Product>();
let nextId = 1;

function newId(): string {
  return `p-${nextId++}`;
}

export function seed(): void {
  products.clear();
  nextId = 1;
  const initial: ProductInput[] = [
    { name: "Tastiera meccanica", description: "Switch rossi, layout italiano", priceCents: 8990, stock: 12 },
    { name: "Mouse wireless", description: "Sensore 16000 DPI", priceCents: 3990, stock: 30 },
    { name: "Monitor 27\"", description: "QHD, 144 Hz", priceCents: 27900, stock: 5 },
  ];
  for (const p of initial) create(p);
}

export function list(query?: string): Product[] {
  const all = [...products.values()];
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter((p) => p.name.toLowerCase().includes(q));
}

export function get(id: string): Product | undefined {
  return products.get(id);
}

export function create(input: ProductInput): Product {
  const product: Product = { id: newId(), ...input };
  products.set(product.id, product);
  return product;
}

export function replace(id: string, input: ProductInput): Product | undefined {
  if (!products.has(id)) return undefined;
  const product: Product = { id, ...input };
  products.set(id, product);
  return product;
}

export function remove(id: string): boolean {
  return products.delete(id);
}
