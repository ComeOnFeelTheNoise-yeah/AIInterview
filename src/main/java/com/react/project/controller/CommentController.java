package com.react.project.controller;

import com.react.project.dto.CommentDto;
import com.react.project.entity.CommentEntity;
import com.react.project.service.CommentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/board/{boardId}")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable int boardId) {
        List<CommentEntity> comments = commentService.findCommentsByBoardId(boardId);
        List<CommentDto> commentDtos = comments.stream()
                .map(comment -> modelMapper.map(comment, CommentDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDtos);
    }

    @PostMapping("/comments")
    public ResponseEntity<CommentDto> addComment(@PathVariable int boardId, @RequestBody CommentDto commentDto) {
        CommentEntity comment = modelMapper.map(commentDto, CommentEntity.class);
        comment.setBoardNumber(boardId);
        CommentEntity savedComment = commentService.save(comment);
        CommentDto savedCommentDto = modelMapper.map(savedComment, CommentDto.class);
        return ResponseEntity.ok(savedCommentDto);
    }
}
