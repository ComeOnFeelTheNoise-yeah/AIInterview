package com.react.project.controller;

import com.react.project.dto.CommentDto;
import com.react.project.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/board")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/{boardId}/comment")
    public ResponseEntity<CommentDto> addComment(@PathVariable int boardId, @RequestBody CommentDto commentDto) {
        CommentDto savedComment = commentService.saveComment(boardId, commentDto);
        System.out.println(savedComment);
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }

}
