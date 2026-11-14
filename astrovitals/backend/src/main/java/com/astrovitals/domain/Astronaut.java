package com.astrovitals.domain;

import jakarta.persistence.*;

@Entity
public class Astronaut {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    protected Astronaut() {}
    public Astronaut(String name) { this.name = name; }
    public Long getId() { return id; }
    public String getName() { return name; }
}
