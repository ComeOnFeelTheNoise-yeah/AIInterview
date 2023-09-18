package com.react.project.service;

import com.react.project.dto.ResponseDto;
import com.react.project.dto.SignInDto;
import com.react.project.dto.SignInResponseDto;
import com.react.project.dto.SignUpDto;
import com.react.project.entity.UserEntity;
import com.react.project.repository.UserRepository;
import com.react.project.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    TokenProvider tokenProvider;
    public ResponseDto<?> signUp(SignUpDto dto){
        String userEmail = dto.getUserEmail();
        String userPassword = dto.getUserPassword();
        String userPasswordCheck = dto.getUserPasswordCheck();

        try{
            // email 중복 확인
            if(userRepository.existsById(userEmail)){
                return ResponseDto.setFailed("Existed Email");
            }
        }catch (Exception e){
            return ResponseDto.setFailed("Database Error");
        }

        if(!userPassword.equals(userPasswordCheck)){
            return ResponseDto.setFailed("Password does not matched");
        }

        // UserEntity 생성
        UserEntity userEntity = new UserEntity(dto);
        try{
            // UserRepository를 이용해서 데이터베이스에 Entity 저장
            userRepository.save(userEntity);
        }catch (Exception e){
            return ResponseDto.setFailed("Database Error");
        }

        // 성공시 success response 반환
        return ResponseDto.setSuccess("Sign Up Success", null);
    }

    public ResponseDto<SignInResponseDto> signIn(SignInDto dto){
        String userEmail = dto.getUserEmail();
        String userPassword = dto.getUserPassword();
        try {
            boolean existed = userRepository.existsByUserEmailAndUserPassword(userEmail, userPassword);
            if(!existed){
                return ResponseDto.setFailed("Sign In Information Does Not Match");
            }
        }catch (Exception e) {
            return ResponseDto.setFailed("Database Error");
        }

        UserEntity userEntity = null;
        try {
            userEntity = userRepository.findById(userEmail).get();
        }catch (Exception e){
            return ResponseDto.setFailed("Database Error");
        }
        userEntity.setUserPassword("");

        String token = tokenProvider.create(userEmail);
        int exprTime = 3600000;

        SignInResponseDto signInResponseDto = new SignInResponseDto(token, exprTime, userEntity);
        return ResponseDto.setSuccess("Sign In Success", signInResponseDto);
    }
}
