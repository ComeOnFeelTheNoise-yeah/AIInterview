package com.react.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.react.project.entity.BoardEntity;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    public List<BoardEntity> findTop3ByBoardWriterDateAfterOrderByBoardLikesCountDesc(String boardWriterDate);
    public List<BoardEntity> findByOrderByBoardWriterDateDesc();
    public List<BoardEntity> findByBoardTitleContains(String boardTitle);

}
