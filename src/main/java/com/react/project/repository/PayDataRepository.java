package com.react.project.repository;

import com.react.project.entity.PayDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PayDataRepository extends JpaRepository<PayDataEntity, String> { // String 타입의 userEmail을 기준으로 합니다.
}

