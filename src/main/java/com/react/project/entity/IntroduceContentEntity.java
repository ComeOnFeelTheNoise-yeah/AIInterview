package com.react.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "IntroduceContent")
@Table(name = "IntroduceContent")
public class IntroduceContentEntity {
    @Id
    private String userEmail;
    private String introContent;
}
