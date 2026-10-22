// Il "server di posta" del corso: non manda email vere.
// Scrive una riga di log e tiene le ultime email in memoria, per GET /notifications.
//
// MAIL_FAIL_PERCENT simula un server di posta inaffidabile (come il chaos di catalog
// nella lezione 4): una email su N fallisce, e il messaggio torna in coda.
// MAIL_DELAY_MS simula un server lento: utile per vedere i messaggi "unacked".

export interface Email {
  to: string;
  subject: string;
  body: string;
  eventId: string; // l'evento da cui nasce: serve a riconoscere i doppioni
  sentAt: string;
}

export interface Mailer {
  send(email: Omit<Email, "sentAt">): Promise<void>;
  sent(): Email[];
  log?: { info: (obj: object, msg: string) => void };
}

export function createLogMailer({
  log,
  failPercent = 0,
  delayMs = 0,
  random = Math.random,
  keep = 100,
}: {
  log?: { info: (obj: object, msg: string) => void };
  failPercent?: number;
  delayMs?: number;
  random?: () => number;
  keep?: number;
} = {}): Mailer {
  const emails: Email[] = [];
  const mailer: Mailer = {
    log,
    async send(email) {
      if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (failPercent > 0 && random() * 100 < failPercent) {
        throw new Error("server di posta non disponibile (simulato)");
      }
      const sent = { ...email, sentAt: new Date().toISOString() };
      emails.push(sent);
      if (emails.length > keep) emails.shift();
      mailer.log?.info({ to: email.to, subject: email.subject, eventId: email.eventId }, "email inviata");
    },
    sent: () => [...emails],
  };
  return mailer;
}
