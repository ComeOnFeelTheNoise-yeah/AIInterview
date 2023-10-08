package com.react.project.controller;

import com.react.project.entity.IntroduceContentEntity;
import com.react.project.service.IntroduceContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class IntroduceContentController {

    @Autowired
    private IntroduceContentService service;

    @PostMapping("/save-content")
    public IntroduceContentEntity saveContent(@RequestBody IntroduceContentEntity entity) {
        if (entity.getId() != null) {
            return service.updateContent(entity);
        } else {
            return service.saveContent(entity);
        }
    }


    @GetMapping("/get-content")
    public ResponseEntity<IntroduceContentEntity> getContent(@RequestParam String userEmail) {
        return ResponseEntity.ok(service.getContentByUserEmail(userEmail));
    }

    @GetMapping("/get-titles")
    public ResponseEntity<List<String>> getTitles(@RequestParam String userEmail) {
        return ResponseEntity.ok(service.getTitlesByUserEmail(userEmail));
    }

    @GetMapping("/get-content-by-title")
    public ResponseEntity<IntroduceContentEntity> getContentByTitle(@RequestParam String userEmail, @RequestParam String title) {
        return ResponseEntity.ok(service.getContentByUserEmailAndTitle(userEmail, title));
    }

    @DeleteMapping("/delete-content")
    public ResponseEntity<String> deleteContent(@RequestParam String userEmail, @RequestParam String title) {
        try {
            service.deleteContentByUserEmailAndTitle(userEmail, title);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
