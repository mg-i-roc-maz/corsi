package com.example.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titolo;
    private String contenuto;
    private LocalDateTime dataCreazione;

    @Column(name = "post_like")
    private int postLike = 0;

    @Column(name = "post_dislike")
    private int postDislike = 0;

    public Post() {
    }

    public Post(String titolo, String contenuto, LocalDateTime dataCreazione) {
        this.titolo = titolo;
        this.contenuto = contenuto;
        this.dataCreazione = dataCreazione;
        this.postLike = 0;
    }

    public Long getId() {
        return id;
    }

    public String getTitolo() {
        return titolo;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }

    public String getContenuto() {
        return contenuto;
    }

    public void setContenuto(String contenuto) {
        this.contenuto = contenuto;
    }

    public LocalDateTime getDataCreazione() {
        return dataCreazione;
    }

    public void setDataCreazione(LocalDateTime dataCreazione) {
        this.dataCreazione = dataCreazione;
    }

    public int getPostLike() {
        return postLike;
    }

    public void setPostLike(int postLike) {
        this.postLike = postLike;
    }

    public int getPostDislike() {
        return postDislike;
    }

    public void setPostDislike(int postDislike) {
        this.postDislike = postDislike;
    }
}
