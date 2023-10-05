package com.react.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.react.project.entity.IntroduceContentEntity;

import java.util.Optional;

@Repository
public interface IntroduceContentRepository extends JpaRepository<IntroduceContentEntity, Long> {
    Optional<IntroduceContentEntity> findByUserEmail(String userEmail);
}

