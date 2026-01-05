package fitnessclub;

public class Sala {
    private String nome;
    private int capienza;
    private String[] orariDisponibili;

    public Sala() {
    }

    public Sala(String nome, int capienza, String[] orariDisponibili) {
        this.nome = nome;
        this.capienza = capienza;
        this.orariDisponibili = orariDisponibili;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getCapienza() {
        return capienza;
    }

    public void setCapienza(int capienza) {
        this.capienza = capienza;
    }

    public String[] getOrariDisponibili() {
        return orariDisponibili;
    }

    public void setOrariDisponibili(String[] orariDisponibili) {
        this.orariDisponibili = orariDisponibili;
    }
}
