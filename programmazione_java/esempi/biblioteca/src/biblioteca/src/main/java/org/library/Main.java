package org.library;
import org.library.entity.Book;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");


        Book b = new Book("Il Signore degli Anelli", "978-0261102385", "J.R.R. Tolkien");
        System.out.println(b);
    }
}