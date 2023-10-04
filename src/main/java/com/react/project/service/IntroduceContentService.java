package com.react.project.service;

import com.react.project.entity.IntroduceContentEntity;
import com.react.project.repository.IntroduceContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IntroduceContentService {

    @Autowired
    private IntroduceContentRepository repository;

    public IntroduceContentEntity saveContent(IntroduceContentEntity entity) {
        return repository.save(entity);
    }

    public IntroduceContentEntity getContentByUserEmail(String userEmail) {
        return repository.findByUserEmail(userEmail).orElse(null);
    }
}

