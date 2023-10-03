package com.react.project.controller;

import com.react.project.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Autowired
    private S3Service s3Service;

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = s3Service.uploadFile(file);
        return ResponseEntity.ok().body("File uploaded: " + fileName);
    }

    @PostMapping("/uploadProfileImage")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("image") MultipartFile file) {
        String imageUrl = null;
        try {
            // 파일을 S3에 업로드하고 URL을 가져옵니다.
            imageUrl = s3Service.uploadFile(file);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // S3 URL을 반환합니다.
        return new ResponseEntity<>(Collections.singletonMap("imageUrl", imageUrl), HttpStatus.OK);
    }
}

