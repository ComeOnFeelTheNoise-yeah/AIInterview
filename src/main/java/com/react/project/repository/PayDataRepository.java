package com.react.project.repository;

import com.react.project.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PayDataRepository extends JpaRepository<BoardEntity, Integer> {

}
