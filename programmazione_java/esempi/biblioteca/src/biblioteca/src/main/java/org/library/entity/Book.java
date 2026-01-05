package org.library.entity;

public class Book {

    private String title;
    private String isbn;
    private String author;
    private boolean available;
    
    public Book(String title, String isbn, String author) {
        this.title = title;
        this.isbn = isbn;
        this.author = author;
        this.available = true;
    }

    public boolean isAvailable() {
        return available;
    }

    @Override
    public String toString() {
        return "Book{" +
                "title='" + title + '\'' +
                ", isbn='" + isbn + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}