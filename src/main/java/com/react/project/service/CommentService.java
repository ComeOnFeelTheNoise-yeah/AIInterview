package com.react.project.service;

import com.react.project.dto.CommentDto;
import com.react.project.entity.CommentEntity;
import com.react.project.repository.CommentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;  // 추가
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<CommentEntity> findCommentsByBoardId(int boardId) {
        return commentRepository.findByBoardNumber(boardId);
    }

    @Transactional
    public CommentEntity save(CommentEntity comment) {
        return commentRepository.save(comment);
    }
}


