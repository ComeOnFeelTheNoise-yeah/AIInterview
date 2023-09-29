package com.react.project.repository;

import com.react.project.entity.IntroduceDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IntroduceDataRepository extends JpaRepository<IntroduceDataEntity, Integer> {

}
