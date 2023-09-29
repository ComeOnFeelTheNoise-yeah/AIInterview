package com.react.project.service;

import com.react.project.dto.ResponseDto;
import com.react.project.entity.BoardEntity;
import com.react.project.entity.PopularSearchEntity;
import com.react.project.repository.BoardRepository;
import com.react.project.repository.PopularSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class BoardService {
    @Autowired
    BoardRepository boardRepository;
    @Autowired
    PopularSearchRepository popularSearchRepository;

    public ResponseDto<List<BoardEntity>> getTop3(){
        List<BoardEntity> boardList = new ArrayList<BoardEntity>();
        Timestamp date = Timestamp.from(Instant.now().minus(7, ChronoUnit.DAYS));

        try{
            boardList = boardRepository.findTop3ByBoardWriterDateAfterOrderByBoardLikesCountDesc(String.valueOf(date));
        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.setFailed("Database Error");
        }
        return ResponseDto.setSuccess("Success", boardList);
    }

    public ResponseDto<List<BoardEntity>> getList(){
        List<BoardEntity> boardList = new ArrayList<BoardEntity>();

        try{
            boardList = boardRepository.findByOrderByBoardWriterDateDesc();
        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.setFailed("Database Error");
        }
        return ResponseDto.setSuccess("Success", boardList);
    }

    public ResponseDto<List<PopularSearchEntity>> getPopularSearchList(){
        List<PopularSearchEntity> popularSearchList = new ArrayList<PopularSearchEntity>();

        try{
            popularSearchList = popularSearchRepository.findByOrderByPopularSearchCountDesc();
        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.setFailed("Database Error");
        }
        return ResponseDto.setSuccess("Success", popularSearchList);
    }

    public ResponseDto<List<BoardEntity>> getSearchList(String boardTitle){
        List<BoardEntity> boardList = new ArrayList<BoardEntity>();

        try{
            boardList = boardRepository.findByBoardTitleContains(boardTitle);
        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.setFailed("Database Error");
        }

        return ResponseDto.setSuccess("Success", boardList);
    }
}
