package org.example;


//todo: inserire sesso
public abstract class Animal {
    protected String name;
    protected int age;

    public Animal(String name) {
        this.name = name;
        this.age = -1;
    }

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public abstract void makeSound();

    public void info() {
        System.out.println("Nome: " + name + " - Età: " + (age == -1 ? "sconosciuta" : age + " anni"));
    }
}
