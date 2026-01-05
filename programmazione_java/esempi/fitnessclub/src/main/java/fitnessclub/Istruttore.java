package fitnessclub;

public class Istruttore {
    private String nome;
    private String[] specializzazioni;
    private String[] orariDisponibili;

    public Istruttore() {
    }

    public Istruttore(String nome, String[] specializzazioni, String[] orariDisponibili) {
        this.nome = nome;
        this.specializzazioni = specializzazioni;
        this.orariDisponibili = orariDisponibili;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String[] getSpecializzazioni() {
        return specializzazioni;
    }

    public void setSpecializzazioni(String[] specializzazioni) {
        this.specializzazioni = specializzazioni;
    }

    public String[] getOrariDisponibili() {
        return orariDisponibili;
    }

    public void setOrariDisponibili(String[] orariDisponibili) {
        this.orariDisponibili = orariDisponibili;
    }
}
