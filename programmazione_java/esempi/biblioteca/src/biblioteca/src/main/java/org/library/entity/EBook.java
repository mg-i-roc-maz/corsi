package org.library.entity;

public class EBook extends Book {

    private String format;
    private double fileSizeMB;

    public EBook(String title, String isbn, String author, String format, double fileSizeMB) {
        super(title, isbn, author);
        this.format = format;
        this.fileSizeMB = fileSizeMB;
    }

    @Override
    public String toString() {
        return "EBook{" +
                "format='" + format + '\'' +
                ", fileSizeMB=" + fileSizeMB +
                "} " + super.toString();
    }
}