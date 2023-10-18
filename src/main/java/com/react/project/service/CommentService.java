package com.react.project.service;

import com.react.project.dto.CommentDto;
import com.react.project.entity.CommentEntity;
import com.react.project.repository.CommentRepository;
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

    public CommentDto saveComment(int boardId, CommentDto commentDto) {
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setBoardNumber(boardId);
        commentEntity.setUserEmail(commentDto.getUserEmail());
        commentEntity.setCommentContent(commentDto.getCommentContent());
        commentEntity.setCommentUserProfile(commentDto.getCommentUserProfile());
        commentEntity.setCommentUserNickname(commentDto.getCommentUserNickname());
        commentEntity.setCommentWriteDate(LocalDateTime.now());

        CommentEntity savedComment = commentRepository.save(commentEntity);

        CommentDto resultDto = new CommentDto();
        resultDto.setBoardNumber(savedComment.getBoardNumber());
        resultDto.setUserEmail(savedComment.getUserEmail());
        resultDto.setCommentContent(savedComment.getCommentContent());
        resultDto.setCommentUserProfile(savedComment.getCommentUserProfile());
        resultDto.setCommentUserNickname(savedComment.getCommentUserNickname());
        resultDto.setCommentWriteDate(String.valueOf(savedComment.getCommentWriteDate()));

        return resultDto;
    }

    public List<CommentDto> getCommentsByBoardId(int boardId) {
        List<CommentEntity> comments = commentRepository.findByBoardNumber(boardId);
        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CommentDto convertToDto(CommentEntity commentEntity) {
        CommentDto commentDto = new CommentDto();
        commentDto.setCommentId(commentEntity.getCommentId());
        commentDto.setBoardNumber(commentEntity.getBoardNumber());
        commentDto.setUserEmail(commentEntity.getUserEmail());
        commentDto.setCommentContent(commentEntity.getCommentContent());
        commentDto.setCommentUserProfile(commentEntity.getCommentUserProfile());
        commentDto.setCommentUserNickname(commentEntity.getCommentUserNickname());
        commentDto.setCommentWriteDate(commentEntity.getCommentWriteDate().toString());  // LocalDateTime을 문자열로 변환
        return commentDto;
    }

}

