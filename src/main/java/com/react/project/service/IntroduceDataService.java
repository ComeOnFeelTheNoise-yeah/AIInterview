package com.react.project.service;

import com.react.project.entity.IntroduceDataEntity;
import com.react.project.repository.IntroduceDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IntroduceDataService {
    private final IntroduceDataRepository introduceDataRepository;

    @Autowired
    public IntroduceDataService(IntroduceDataRepository introduceDataRepository) {
        this.introduceDataRepository = introduceDataRepository;
    }

    public IntroduceDataEntity saveIntroduceData(IntroduceDataEntity introduceData) {
        return introduceDataRepository.save(introduceData);
    }
}
