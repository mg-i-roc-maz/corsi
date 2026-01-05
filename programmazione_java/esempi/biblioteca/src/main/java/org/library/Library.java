package org.library;
import java.util.ArrayList;

public class Library {

    private String address;
    private ArrayList<Book> books;

    private ArrayList<Book> booksNotAvailable;

    public Library(){
        books = new ArrayList<>();
        booksNotAvailable = new ArrayList<>();
    }

    public Book addBook(Book book){
        books.add(book);
        return book;
    }

    public Book rentBook(Book book){
        if(book.isAvailable() && books.remove(book)){
            booksNotAvailable.add(book);
            return book;
        }
        return null;
    }



}