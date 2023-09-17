package com.react.project.controller;

import com.react.project.dto.ResponseDto;
import com.react.project.dto.SignUpDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody SignUpDto requestBody){
        System.out.println(requestBody.toString());
        return null;
    }
}
