
package fitnessclub;

import fitnessclub.Abbonamento;

public class Utente {
    private String nome;
    private String cognome;
    private String dataNascita;
    private Abbonamento abbonamento;

    public Utente() {
    }

    public Utente(String nome, String cognome, String dataNascita, Abbonamento abbonamento) {
        this.nome = nome;
        this.cognome = cognome;
        this.dataNascita = dataNascita;
        this.abbonamento = abbonamento;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public String getDataNascita() {
        return dataNascita;
    }

    public void setDataNascita(String dataNascita) {
        this.dataNascita = dataNascita;
    }

    public Abbonamento getAbbonamento() {
        return abbonamento;
    }

    public void setAbbonamento(Abbonamento abbonamento) {
        this.abbonamento = abbonamento;
    }
}
