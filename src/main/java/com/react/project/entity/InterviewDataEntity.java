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
@Entity(name = "InterviewData")
@Table(name = "InterviewData")
public class InterviewDataEntity {
    @Id
    private String userEmail;
    private String interviewContent;
}
