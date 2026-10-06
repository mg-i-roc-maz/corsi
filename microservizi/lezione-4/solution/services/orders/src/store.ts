// Archivio degli ordini, per ora in memoria.
// Il servizio orders ha i SUOI dati: non legge e non scrive le tabelle del catalogo.

export interface OrderItem {
  productId: string;
  quantity: number;
}

// Una riga d'ordine "fotografa" nome e prezzo al momento dell'acquisto:
// se domani catalog cambia il prezzo, l'ordine di oggi non deve cambiare.
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
  status: "confirmed";
  createdAt: string;
}

export interface OrderStore {
  list(): Order[];
  get(id: string): Order | undefined;
  create(customerEmail: string, lines: OrderLine[]): Order;
}

export function createOrderStore(): OrderStore {
  const orders = new Map<string, Order>();
  let nextId = 1;
  return {
    list: () => [...orders.values()],
    get: (id) => orders.get(id),
    create(customerEmail, lines) {
      const order: Order = {
        id: `o-${nextId++}`,
        customerEmail,
        lines,
        totalCents: lines.reduce((sum, l) => sum + l.quantity * l.unitPriceCents, 0),
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      orders.set(order.id, order);
      return order;
    },
  };
}
