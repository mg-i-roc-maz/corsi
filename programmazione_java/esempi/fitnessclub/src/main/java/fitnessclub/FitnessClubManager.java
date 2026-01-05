package fitnessclub;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.*;

public class FitnessClubManager {
    private List<Utente> utenti = new ArrayList<>();
    private List<Abbonamento> abbonamenti = new ArrayList<>();
    private List<Istruttore> istruttori = new ArrayList<>();
    private List<Corso> corsi = new ArrayList<>();
    private List<Sala> sale = new ArrayList<>();
    private List<Prenotazione> prenotazioni = new ArrayList<>();
    private Scanner scanner = new Scanner(System.in);
    private final String FILE_JSON = "fitnessclub_data.json";

    public static void main(String[] args) {
        FitnessClubManager manager = new FitnessClubManager();
        manager.menu();
    }

    private void menu() {
        caricaDati();
        while (true) {
            System.out.println("\n--- FITNESS CLUB ---");
            System.out.println("1. Gestisci Utenti");
            System.out.println("2. Gestisci Abbonamenti");
            System.out.println("3. Gestisci Istruttori");
            System.out.println("4. Gestisci Corsi");
            System.out.println("5. Gestisci Sale");
            System.out.println("6. Gestisci Prenotazioni");
            System.out.println("7. Salva dati su file JSON");
            System.out.println("8. Carica dati da file JSON");
            System.out.println("0. Esci");
            System.out.print("Scegli un'opzione: ");
            int scelta = leggiInt();
            switch (scelta) {
                case 1:
                    gestisciUtenti();
                    break;
                case 2:
                    gestisciAbbonamenti();
                    break;
                case 3:
                    gestisciIstruttori();
                    break;
                case 4:
                    gestisciCorsi();
                    break;
                case 5:
                    gestisciSale();
                    break;
                case 6:
                    gestisciPrenotazioni();
                    break;
                case 7:
                    salvaDati();
                    break;
                case 8:
                    caricaDati();
                    break;
                case 0:
                    System.out.println("Arrivederci!");
                    return;
                default:
                    System.out.println("Opzione non valida.");
            }
        }
    }

    // --- SALVATAGGIO E CARICAMENTO DATI ---
    private void salvaDati() {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            Map<String, Object> data = new HashMap<>();
            data.put("utenti", utenti);
            data.put("abbonamenti", abbonamenti);
            data.put("istruttori", istruttori);
            data.put("corsi", corsi);
            data.put("sale", sale);
            data.put("prenotazioni", prenotazioni);
            String json = gson.toJson(data);
            java.nio.file.Files.write(java.nio.file.Paths.get(FILE_JSON), json.getBytes());
            System.out.println("Dati salvati su " + FILE_JSON);
        } catch (Exception e) {
            System.out.println("Errore nel salvataggio: " + e.getMessage());
        }
    }

    private void caricaDati() {
        try {
            java.nio.file.Path path = java.nio.file.Paths.get(FILE_JSON);
            if (!java.nio.file.Files.exists(path))
                return;
            String json = new String(java.nio.file.Files.readAllBytes(path));
            Gson gson = new Gson();
            Map<String, Object> data = gson.fromJson(json, Map.class);
            // NOTA: Per semplicità, il caricamento ricrea solo le liste base (non oggetti
            // complessi)
            // Per una deserializzazione completa servirebbero TypeToken e costruttori
            // specifici
            utenti.clear();
            abbonamenti.clear();
            istruttori.clear();
            corsi.clear();
            sale.clear();
            prenotazioni.clear();

            Gson gsonList = new Gson();

            if (data.get("utenti") != null) {
                List<?> list = (List<?>) data.get("utenti");
                for (Object o : list) {
                    String jsonObj = gsonList.toJson(o);
                    Utente u = gsonList.fromJson(jsonObj, Utente.class);
                    utenti.add(u);
                }
            }
            if (data.get("abbonamenti") != null) {
                List<?> list = (List<?>) data.get("abbonamenti");
                for (Object o : list) {
                    String jsonObj = gsonList.toJson(o);
                    Abbonamento a = gsonList.fromJson(jsonObj, Abbonamento.class);
                    abbonamenti.add(a);
                }
            }
            if (data.get("istruttori") != null) {
                List<?> list = (List<?>) data.get("istruttori");
                for (Object o : list) {
                    String jsonObj = gsonList.toJson(o);
                    Istruttore i = gsonList.fromJson(jsonObj, Istruttore.class);
                    istruttori.add(i);
                }
            }
            if (data.get("corsi") != null) {
                List<?> list = (List<?>) data.get("corsi");
                for (Object o : list) {
                    String jsonObj = gsonList.toJson(o);
                    Corso c = gsonList.fromJson(jsonObj, Corso.class);
                    corsi.add(c);
                }
            }
            if (data.get("sale") != null) {
                List<?> list = (List<?>) data.get("sale");
                for (Object o : list) {
                    String jsonObj = gsonList.toJson(o);
                    Sala s = gsonList.fromJson(jsonObj, Sala.class);
                    sale.add(s);
                }
            }
            if (data.get("prenotazioni") != null) {
                List<?> list = (List<?>) data.get("prenotazioni");
                for (Object o : list) {
                    String jsonObj = gsonList.toJson(o);
                    Prenotazione p = gsonList.fromJson(jsonObj, Prenotazione.class);
                    prenotazioni.add(p);
                }
            }
            System.out.println("Dati caricati da " + FILE_JSON);
        } catch (Exception e) {
            System.out.println("Errore nel caricamento: " + e.getMessage());
        }
    }

    // --- UTENTI ---
    private void gestisciUtenti() {
        System.out.println("\n--- Gestione Utenti ---");
        System.out.println("1. Aggiungi Utente");
        System.out.println("2. Visualizza Utenti");
        System.out.println("3. Associa abbonamento a Utente");
        System.out.println("0. Indietro");
        int scelta = leggiInt();
        switch (scelta) {
            case 1:
                aggiungiUtente();
                break;
            case 2:
                visualizzaUtenti();
                break;
            case 3:
                associaAbbonamentoAUtente();
                break;
            case 0:
                return;
            default:
                System.out.println("Opzione non valida.");
        }
    }

    private void associaAbbonamentoAUtente() {
        System.out.print("Utente (indice): ");
        visualizzaUtenti();
        int idxU = leggiInt();
        if (idxU < 0 || idxU >= utenti.size()) {
            System.out.println("Indice non valido.");
            return;
        }
        Utente u = utenti.get(idxU);
        System.out.print("Abbonamento (indice): ");
        visualizzaAbbonamenti();
        int idxA = leggiInt();
        if (idxA < 0 || idxA >= abbonamenti.size()) {
            System.out.println("Indice non valido.");
            return;
        }
        Abbonamento a = abbonamenti.get(idxA);
        u.setAbbonamento(a);
        System.out.println("Abbonamento associato all'utente.");
    }

    private void aggiungiUtente() {
        System.out.print("Nome: ");
        String nome = scanner.nextLine();
        System.out.print("Cognome: ");
        String cognome = scanner.nextLine();
        System.out.print("Data di nascita (YYYY-MM-DD): ");
        String dataNascita = scanner.nextLine();
        Utente u = new Utente(nome, cognome, dataNascita, null);
        utenti.add(u);
        System.out.println("Utente aggiunto.");
    }

    private void visualizzaUtenti() {
        if (utenti.isEmpty()) {
            System.out.println("Nessun utente.");
            return;
        }
        for (Utente u : utenti) {
            System.out.println(u.getNome() + " " + u.getCognome() + " - Nascita: " + u.getDataNascita());
        }
    }

    // --- ABBONAMENTI ---
    private void gestisciAbbonamenti() {
        System.out.println("\n--- Gestione Abbonamenti ---");
        System.out.println("1. Aggiungi Abbonamento");
        System.out.println("2. Visualizza Abbonamenti");
        System.out.println("0. Indietro");
        int scelta = leggiInt();
        switch (scelta) {
            case 1:
                aggiungiAbbonamento();
                break;
            case 2:
                visualizzaAbbonamenti();
                break;
            case 0:
                return;
            default:
                System.out.println("Opzione non valida.");
        }
    }

    private void aggiungiAbbonamento() {
        System.out.print("Tipo: ");
        String tipo = scanner.nextLine();
        System.out.print("Data inizio (YYYY-MM-DD): ");
        String inizio = scanner.nextLine();
        System.out.print("Data fine (YYYY-MM-DD): ");
        String fine = scanner.nextLine();
        Abbonamento a = new Abbonamento(tipo, inizio, fine, true);
        abbonamenti.add(a);
        System.out.println("Abbonamento aggiunto.");
    }

    private void visualizzaAbbonamenti() {
        if (abbonamenti.isEmpty()) {
            System.out.println("Nessun abbonamento.");
            return;
        }
        for (Abbonamento a : abbonamenti) {
            System.out.println(
                    a.getTipo() + " - " + a.getDataInizio() + " -> " + a.getDataFine() + " | Attivo: " + a.isAttivo());
        }
    }

    // --- ISTRUTTORI ---
    private void gestisciIstruttori() {
        System.out.println("\n--- Gestione Istruttori ---");
        System.out.println("1. Aggiungi Istruttore");
        System.out.println("2. Visualizza Istruttori");
        System.out.println("0. Indietro");
        int scelta = leggiInt();
        switch (scelta) {
            case 1:
                aggiungiIstruttore();
                break;
            case 2:
                visualizzaIstruttori();
                break;
            case 0:
                return;
            default:
                System.out.println("Opzione non valida.");
        }
    }

    private void aggiungiIstruttore() {
        System.out.print("Nome: ");
        String nome = scanner.nextLine();
        System.out.print("Specializzazioni (separate da virgola): ");
        String spec = scanner.nextLine();
        String[] specializzazioni = spec.split(",");
        Istruttore i = new Istruttore(nome, specializzazioni, new String[0]);
        istruttori.add(i);
        System.out.println("Istruttore aggiunto.");
    }

    private void visualizzaIstruttori() {
        if (istruttori.isEmpty()) {
            System.out.println("Nessun istruttore.");
            return;
        }
        for (Istruttore i : istruttori) {
            System.out.println(i.getNome() + " - Specializzazioni: " + String.join(", ", i.getSpecializzazioni()));
        }
    }

    // --- CORSI ---
    private void gestisciCorsi() {
        System.out.println("\n--- Gestione Corsi ---");
        System.out.println("1. Aggiungi Corso");
        System.out.println("2. Visualizza Corsi");
        System.out.println("0. Indietro");
        int scelta = leggiInt();
        switch (scelta) {
            case 1:
                aggiungiCorso();
                break;
            case 2:
                visualizzaCorsi();
                break;
            case 0:
                return;
            default:
                System.out.println("Opzione non valida.");
        }
    }

    private void aggiungiCorso() {
        System.out.print("Nome corso: ");
        String nome = scanner.nextLine();
        System.out.print("Istruttore (indice): ");
        visualizzaIstruttori();
        int idx = leggiInt();
        if (idx < 0 || idx >= istruttori.size()) {
            System.out.println("Indice non valido.");
            return;
        }
        Istruttore istr = istruttori.get(idx);
        System.out.print("Max partecipanti: ");
        int max = leggiInt();
        Corso c = new Corso(nome, istr, max, new ArrayList<>());
        corsi.add(c);
        System.out.println("Corso aggiunto.");
    }

    private void visualizzaCorsi() {
        if (corsi.isEmpty()) {
            System.out.println("Nessun corso.");
            return;
        }
        int i = 0;
        for (Corso c : corsi) {
            System.out.println(i + ". " + c.getNome() + " - Istruttore: " + c.getIstruttore().getNome() + " - Max: "
                    + c.getMaxPartecipanti());
            i++;
        }
    }

    // --- SALE ---
    private void gestisciSale() {
        System.out.println("\n--- Gestione Sale ---");
        System.out.println("1. Aggiungi Sala");
        System.out.println("2. Visualizza Sale");
        System.out.println("0. Indietro");
        int scelta = leggiInt();
        switch (scelta) {
            case 1:
                aggiungiSala();
                break;
            case 2:
                visualizzaSale();
                break;
            case 0:
                return;
            default:
                System.out.println("Opzione non valida.");
        }
    }

    private void aggiungiSala() {
        System.out.print("Nome sala: ");
        String nome = scanner.nextLine();
        System.out.print("Capienza: ");
        int capienza = leggiInt();
        Sala s = new Sala(nome, capienza, new String[0]);
        sale.add(s);
        System.out.println("Sala aggiunta.");
    }

    private void visualizzaSale() {
        if (sale.isEmpty()) {
            System.out.println("Nessuna sala.");
            return;
        }
        int i = 0;
        for (Sala s : sale) {
            System.out.println(i + ". " + s.getNome() + " - Capienza: " + s.getCapienza());
            i++;
        }
    }

    // --- PRENOTAZIONI ---
    private void gestisciPrenotazioni() {
        System.out.println("\n--- Gestione Prenotazioni ---");
        System.out.println("1. Aggiungi Prenotazione");
        System.out.println("2. Visualizza Prenotazioni");
        System.out.println("0. Indietro");
        int scelta = leggiInt();
        switch (scelta) {
            case 1:
                aggiungiPrenotazione();
                break;
            case 2:
                visualizzaPrenotazioni();
                break;
            case 0:
                return;
            default:
                System.out.println("Opzione non valida.");
        }
    }

    private void aggiungiPrenotazione() {
        System.out.print("Utente (indice): ");
        visualizzaUtenti();
        int idxU = leggiInt();
        if (idxU < 0 || idxU >= utenti.size()) {
            System.out.println("Indice non valido.");
            return;
        }
        Utente u = utenti.get(idxU);
        System.out.print("Sala (indice): ");
        visualizzaSale();
        int idxS = leggiInt();
        if (idxS < 0 || idxS >= sale.size()) {
            System.out.println("Indice non valido.");
            return;
        }
        Sala s = sale.get(idxS);
        System.out.print("Fascia oraria: ");
        String fascia = scanner.nextLine();
        Prenotazione p = new Prenotazione(u, s, fascia);
        prenotazioni.add(p);
        System.out.println("Prenotazione aggiunta.");
    }

    private void visualizzaPrenotazioni() {
        if (prenotazioni.isEmpty()) {
            System.out.println("Nessuna prenotazione.");
            return;
        }
        for (Prenotazione p : prenotazioni) {
            System.out.println(p.getUtente().getNome() + " " + p.getUtente().getCognome() + " - Sala: "
                    + p.getSala().getNome() + " - Fascia: " + p.getFasciaOraria());
        }
    }

    // --- UTILITY ---
    private int leggiInt() {
        try {
            String s = scanner.nextLine();
            return Integer.parseInt(s);
        } catch (Exception e) {
            return -1;
        }
    }
}
