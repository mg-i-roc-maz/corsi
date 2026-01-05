package fitnessclub;

public class Prenotazione {
    private Utente utente;
    private Sala sala;
    private String fasciaOraria;

    public Prenotazione() {
    }

    public Prenotazione(Utente utente, Sala sala, String fasciaOraria) {
        this.utente = utente;
        this.sala = sala;
        this.fasciaOraria = fasciaOraria;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public Sala getSala() {
        return sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public String getFasciaOraria() {
        return fasciaOraria;
    }

    public void setFasciaOraria(String fasciaOraria) {
        this.fasciaOraria = fasciaOraria;
    }
}
