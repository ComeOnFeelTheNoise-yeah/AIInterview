package com.react.project.service;

import com.react.project.entity.IntroduceContentEntity;
import com.react.project.repository.IntroduceContentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public List<String> getTitlesByUserEmail(String userEmail) {
        return repository.findTitlesByUserEmail(userEmail);
    }

    public IntroduceContentEntity getContentByUserEmailAndTitle(String userEmail, String title) {
        return repository.findByUserEmailAndTitle(userEmail, title).orElse(null);
    }

    public IntroduceContentEntity updateContent(IntroduceContentEntity entity) {
        Optional<IntroduceContentEntity> existingEntity = repository.findById(entity.getId());
        if (existingEntity.isPresent()) {
            return repository.save(entity);
        } else {
            throw new RuntimeException("Content not found");
        }
    }

    @Transactional
    public void deleteContentByUserEmailAndTitle(String userEmail, String title) {
        repository.deleteByUserEmailAndTitle(userEmail, title);
    }

}

