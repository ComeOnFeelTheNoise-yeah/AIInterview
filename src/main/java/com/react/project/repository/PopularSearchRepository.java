package com.react.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.react.project.entity.PopularSearchEntity;

@Repository
public interface PopularSearchRepository extends JpaRepository<PopularSearchEntity, String> {

}
