package com.react.project.controller;

import com.react.project.service.ImageService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/uploadProfileImage")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("profileImage") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File cannot be empty");
        }
        String imageUrl = imageService.uploadImage(file);
        if (imageUrl != null) {
            return ResponseEntity.ok(new ImageResponse(imageUrl));
        }
        return ResponseEntity.badRequest().build();
    }

}

@Getter
class ImageResponse {
    private String imageUrl;

    public ImageResponse(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

