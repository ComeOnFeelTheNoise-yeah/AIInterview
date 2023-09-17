package com.react.project.service;

import com.react.project.dto.ResponseDto;
import com.react.project.dto.SignUpDto;
import com.react.project.entity.UserEntity;
import com.react.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;
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
}
