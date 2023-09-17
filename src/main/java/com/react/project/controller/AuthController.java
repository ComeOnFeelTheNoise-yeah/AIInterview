package com.react.project.controller;

import com.react.project.dto.ResponseDto;
import com.react.project.dto.SignUpDto;
import com.react.project.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;
    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody SignUpDto requestBody){
        ResponseDto<?> result = authService.signUp(requestBody);
        return result;
    }
}
