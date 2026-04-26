package com.lab.web.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor
@Entity
@Table(name = "web4_point_data")
public class PointData implements Serializable {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    private Double x;
    private Double y;
    private Double r;
    private Boolean hit;

    @Column(name = "exec_time")
    @JsonProperty("execTime")
    private Long executionTime;

    private LocalDateTime date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // @JsonIgnore
    // @Column(name = "user_id")
    // private Long userId;

    public PointData(Double x, Double y, Double r, Boolean hit, Long executionTime, LocalDateTime date, User user) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.executionTime = executionTime;
        this.date = date;
        this.user = user;
    }

    @JsonProperty("dateFormatted")
    public String getDataFormatted() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        return date.format(formatter);
    }

    @Override
    public String toString() {
        return "PointData{" +
               "x = " + x +
               ", y = " + y +
               ", r = " + r +
               ", hit = " + hit +
               ", executionTime = " + executionTime +
               ", date = " + date +
               ", userId = " + (user != null ? user.getId() : null) +
               '}';
    }
}