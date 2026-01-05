package fitnessclub;

import java.util.List;

public class Corso {
    private String nome;
    private Istruttore istruttore;
    private int maxPartecipanti;
    private List<Utente> iscritti;

    public Corso() {
    }

    public Corso(String nome, Istruttore istruttore, int maxPartecipanti, List<Utente> iscritti) {
        this.nome = nome;
        this.istruttore = istruttore;
        this.maxPartecipanti = maxPartecipanti;
        this.iscritti = iscritti;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Istruttore getIstruttore() {
        return istruttore;
    }

    public void setIstruttore(Istruttore istruttore) {
        this.istruttore = istruttore;
    }

    public int getMaxPartecipanti() {
        return maxPartecipanti;
    }

    public void setMaxPartecipanti(int maxPartecipanti) {
        this.maxPartecipanti = maxPartecipanti;
    }

    public List<Utente> getIscritti() {
        return iscritti;
    }

    public void setIscritti(List<Utente> iscritti) {
        this.iscritti = iscritti;
    }
}
