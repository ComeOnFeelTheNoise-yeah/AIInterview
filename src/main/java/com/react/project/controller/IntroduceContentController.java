package com.react.project.controller;

import com.react.project.entity.IntroduceContentEntity;
import com.react.project.service.IntroduceContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class IntroduceContentController {

    @Autowired
    private IntroduceContentService service;

    @PostMapping("/save-content")
    public IntroduceContentEntity saveContent(@RequestBody IntroduceContentEntity entity) {
        return service.saveContent(entity);
    }

    @GetMapping("/get-content")
    public ResponseEntity<IntroduceContentEntity> getContent(@RequestParam String userEmail) {
        return ResponseEntity.ok(service.getContentByUserEmail(userEmail));
    }
}
