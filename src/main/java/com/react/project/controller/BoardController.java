package com.react.project.controller;

import com.react.project.dto.BoardDto;
import com.react.project.entity.BoardEntity;
import com.react.project.service.BoardService;
import com.react.project.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/board")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private ImageService imageService;

    @GetMapping
    public ResponseEntity<List<BoardEntity>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardEntity> getBoardById(@PathVariable int id) {
        return boardService.getBoardById(id)
                .map(board -> ResponseEntity.ok(board))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BoardEntity> createBoard(@RequestBody BoardEntity board) {
        return ResponseEntity.ok(boardService.saveBoard(board));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardEntity> updateBoard(@PathVariable int id,
                                                   @RequestPart("boardTitle") String boardTitle,
                                                   @RequestPart("boardContent") String boardContent,
                                                   @RequestPart(value = "boardImage", required = false) MultipartFile boardImage) {
        BoardEntity existingBoard = boardService.getBoardById(id)
                .orElseThrow(() -> new RuntimeException("Board not found!"));

        try {
            // 이미지가 요청에 포함되어 있다면 업로드하고 URL을 가져온다.
            if (boardImage != null && !boardImage.isEmpty()) {
                String imageUrl = uploadImage(boardImage);
                existingBoard.setBoardImage(imageUrl);
            }

            // 기존 게시글 데이터를 업데이트한다.
            existingBoard.setBoardTitle(boardTitle);
            existingBoard.setBoardContent(boardContent);

            return ResponseEntity.ok(boardService.saveBoard(existingBoard));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable int id) {
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }

    private String uploadImage(MultipartFile file) throws IOException {  // uploadImage 메서드 추가
        return imageService.uploadImage(file);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Boolean>> createPost(@ModelAttribute BoardDto boardDto,
                                                           @RequestPart(value = "postImage", required = false) MultipartFile postImage) {
        try {
            if (postImage != null && !postImage.isEmpty()) {
                String imageUrl = uploadImage(postImage);
                boardDto.setBoardImage(imageUrl);
            }

            boardService.createPost(boardDto);

            Map<String, Boolean> response = new HashMap<>();
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Boolean> response = new HashMap<>();
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/{id}/incrementView")
    public ResponseEntity<Void> incrementViewCount(@PathVariable int id) {
        boardService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

}
