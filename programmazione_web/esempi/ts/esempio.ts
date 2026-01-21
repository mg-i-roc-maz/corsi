class Animale {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
  parla(): void {
    console.log(this.nome + " fa un verso.");
  }
}

let cane = new Animale("Fido");
cane.parla();