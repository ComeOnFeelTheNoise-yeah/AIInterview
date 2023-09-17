package com.react.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.react.project.entity.InterviewDataEntity;

@Repository
public interface InterviewDataRepository extends JpaRepository<InterviewDataEntity, String> {

}
