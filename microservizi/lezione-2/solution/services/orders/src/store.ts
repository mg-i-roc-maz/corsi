// Archivio degli ordini, per ora in memoria.
// Il servizio orders ha i SUOI dati: non legge e non scrive le tabelle del catalogo.

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  // "pending": l'ordine è stato ricevuto ma prezzi e scorte non sono ancora verificati.
  // Nella lezione 3 orders chiederà a catalog via HTTP e passerà a "confirmed" o "rejected".
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
}

export interface OrderStore {
  list(): Order[];
  get(id: string): Order | undefined;
  create(customerEmail: string, items: OrderItem[]): Order;
}

export function createOrderStore(): OrderStore {
  const orders = new Map<string, Order>();
  let nextId = 1;
  return {
    list: () => [...orders.values()],
    get: (id) => orders.get(id),
    create(customerEmail, items) {
      const order: Order = {
        id: `o-${nextId++}`,
        customerEmail,
        items,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      orders.set(order.id, order);
      return order;
    },
  };
}
