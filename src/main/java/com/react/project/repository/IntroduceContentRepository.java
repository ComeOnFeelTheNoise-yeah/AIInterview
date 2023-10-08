package com.react.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.react.project.entity.IntroduceContentEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface IntroduceContentRepository extends JpaRepository<IntroduceContentEntity, Long> {
    Optional<IntroduceContentEntity> findByUserEmail(String userEmail);

    @Query("SELECT i.title FROM IntroduceContent i WHERE i.userEmail = :userEmail")
    List<String> findTitlesByUserEmail(@Param("userEmail") String userEmail);

    Optional<IntroduceContentEntity> findByUserEmailAndTitle(String userEmail, String title);

    void deleteByUserEmailAndTitle(String userEmail, String title);


}

