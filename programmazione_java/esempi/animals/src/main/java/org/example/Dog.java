package org.example;

//todo: inserire microchip
public class Dog extends Animal implements Pet {

    private boolean pedigree;
    public Dog(String name, int age, boolean pedigree) {
        super(name, age);
        this.pedigree = pedigree;
    }

    @Override
    public void info() {
        super.info();
        System.out.println("Pedigree: " + (pedigree ? "Sì" : "No"));
    }

    @Override
    public void makeSound() {
        System.out.println(name + " dice: Bau Bau!");
    }

    @Override
    public void play() {
        System.out.println(name + " gioca riportando la palla!");
    }
}
