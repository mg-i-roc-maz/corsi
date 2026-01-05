package org.example;
import java.util.ArrayList;
import java.util.Scanner;


public class Main {

    public static void main(String[] args) {


        Scanner scanner = new Scanner(System.in);
        ArrayList<Animal> animals = new ArrayList<>();

        while (true) {
            System.out.println("\n--- Gestione Animali ---");
            System.out.println("1. Aggiungi Cane");
            System.out.println("2. Aggiungi Gatto");
            System.out.println("3. Fai emettere un suono a tutti gli animali");
            System.out.println("4. Mostra info animali");
            System.out.println("5. Gioca con tutti gli animali");
            System.out.println("0. Esci");

            System.out.print("Scelta: ");
            int choice = scanner.nextInt();
            scanner.nextLine();

            switch (choice) {

                case 1 -> {
                    System.out.print("Nome cane: ");
                    String name = scanner.nextLine();
                    System.out.print("Età cane: ");
                    int age = scanner.nextInt();
                    System.out.print("Pedigree (true/false): ");
                    boolean pedigree = scanner.nextBoolean();
                    scanner.nextLine();
                    animals.add(new Dog(name, age, pedigree));
                }

                case 2 -> {
                    System.out.print("Nome gatto: ");
                    String name = scanner.nextLine();
                    System.out.print("Età gatto: ");
                    int age = scanner.nextInt();
                    animals.add(new Cat(name, age, false));
                }

                case 3 -> {
                    System.out.println("\n🐾 Suoni degli animali:");
                    for (Animal a : animals) {
                        a.makeSound();
                    }
                }

                case 4 -> {
                    System.out.println("\n📋 Info animali:");
                    for (Animal a : animals) {
                        a.info();
                    }
                }

                case 5 -> {
                    System.out.println("\n🎮 Gioco:");
                    for (Animal a : animals) {
                        if (a instanceof Pet pet) {
                           pet.play();
                        }
                    }
                }

                case 0 -> {
                    System.out.println("👋 Uscita...");
                    return;
                }

                default -> System.out.println("Scelta non valida!");
            }
        }
    }
}
