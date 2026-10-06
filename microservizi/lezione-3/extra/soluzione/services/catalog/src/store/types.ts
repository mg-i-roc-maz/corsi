// Il "contratto" dell'archivio prodotti.
// Le rotte conoscono solo questa interfaccia: non sanno se sotto c'è
// una Map in memoria o PostgreSQL. Per questo possiamo cambiare database
// senza toccare routes.ts (a parte gli await).

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number; // i prezzi si salvano in centesimi: niente errori di arrotondamento
  stock: number;
}

export type ProductInput = Omit<Product, "id">;

// Esito di una prenotazione di scorte.
export type ReserveResult =
  | { status: "reserved"; product: Product }
  | { status: "not_found" }
  | { status: "insufficient_stock"; available: number };

export interface ProductStore {
  list(query?: string): Promise<Product[]>;
  get(id: string): Promise<Product | undefined>;
  create(input: ProductInput): Promise<Product>;
  replace(id: string, input: ProductInput): Promise<Product | undefined>;
  remove(id: string): Promise<boolean>;
  // Toglie "quantity" pezzi dalle scorte, ma solo se ce ne sono abbastanza.
  // Controllo e sottrazione avvengono insieme: due ordini contemporanei
  // non possono prendere entrambi l'ultimo pezzo.
  reserve(id: string, quantity: number): Promise<ReserveResult>;
  // Extra 1: restituisce pezzi alle scorte (compensazione di una prenotazione).
  release(id: string, quantity: number): Promise<Product | undefined>;
  // Extra 2: più prodotti in una sola chiamata.
  getMany(ids: string[]): Promise<Product[]>;
  close(): Promise<void>;
}

export const initialProducts: ProductInput[] = [
  { name: "Tastiera meccanica", description: "Switch rossi, layout italiano", priceCents: 8990, stock: 12 },
  { name: "Mouse wireless", description: "Sensore 16000 DPI", priceCents: 3990, stock: 30 },
  { name: "Monitor 27\"", description: "QHD, 144 Hz", priceCents: 27900, stock: 5 },
];
