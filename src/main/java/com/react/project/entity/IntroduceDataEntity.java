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
@Entity(name = "introduce_data")
@Table(name = "introduce_data")
public class IntroduceDataEntity {
    @Id
    private String introStandardCompany;
    private String introStandardContent;
    private String introQuestion;
}
