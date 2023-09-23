package com.react.project.controller;

import com.react.project.dto.ResponseDto;
import com.react.project.entity.BoardEntity;
import com.react.project.entity.PopularSearchEntity;
import com.react.project.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    BoardService boardService;

    @GetMapping("/top3")
    public ResponseDto<List<BoardEntity>> getTop3(){
        return boardService.getTop3();
    }

    @GetMapping("/list")
    public ResponseDto<List<BoardEntity>> getList(){
        return boardService.getList();
    }

    @GetMapping("/popularSearchList")
    public ResponseDto<List<PopularSearchEntity>> getPopularSearchList(){
        return boardService.getPopularSearchList();
    }

    @GetMapping("/search/{boardTitle}")
    public ResponseDto<List<BoardEntity>> getSearchList(@PathVariable("boardTitle") String title){
        return null;
    }
}
