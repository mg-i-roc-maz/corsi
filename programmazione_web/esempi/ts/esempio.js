var Animale = /** @class */ (function () {
    function Animale(nome) {
        this.nome = nome;
    }
    Animale.prototype.parla = function () {
        console.log(this.nome + " fa un verso.");
    };
    return Animale;
}());
var cane = new Animale("Fido");
cane.parla();
