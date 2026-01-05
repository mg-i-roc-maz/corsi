package org.example;

public class Cat extends Animal implements Pet {

    private boolean siamese;

    public Cat(String name, int age, boolean siamese) {
        super(name, age);
        this.siamese = siamese;
    }

    public Cat(String name, boolean siamese) {
        super(name);
        this.siamese = siamese;
    }

    @Override
    public void info() {
        super.info();
        System.out.println("Razza: " + (siamese ? "Siamese" : "Non siamese"));
    }

    @Override
    public void makeSound() {
        System.out.println(name + " dice: Miao Miao!");
    }

    @Override
    public void play() {
        System.out.println(name + " gioca con un gomitolo di lana.");
    }
}
