package com.react.project.service;

import com.react.project.dto.ResponseDto;
import com.react.project.dto.SignInDto;
import com.react.project.dto.SignInResponseDto;
import com.react.project.dto.SignUpDto;
import com.react.project.entity.UserEntity;
import com.react.project.repository.UserRepository;
import com.react.project.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    TokenProvider tokenProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
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
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userPassword);
        userEntity.setUserPassword(encodedPassword);

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

        UserEntity userEntity = null;
        try {
            userEntity = userRepository.findByUserEmail(userEmail);
            // 잘못된 이메일
            if(userEntity == null){
                return ResponseDto.setFailed("Sign In Failed");
            }
            // 잘못된 비밀번호
            if(!passwordEncoder.matches(userPassword, userEntity.getUserPassword())){
                return ResponseDto.setFailed("Sign In Failed");
            }
        }catch (Exception e){
            return ResponseDto.setFailed("Database Error");
        }
        userEntity.setUserPassword("");

        String token = tokenProvider.create(userEmail);
        int exprTime = 3600000;

        SignInResponseDto signInResponseDto = new SignInResponseDto(token, exprTime, userEntity);
        return ResponseDto.setSuccess("Sign In Success", signInResponseDto);
    }

    public boolean isNicknameDuplicate(String userNickname) {
        return userRepository.existsByUserNickname(userNickname);
    }

    public boolean verifyUserPassword(String userEmail, String userPassword) {
        UserEntity userEntity = userRepository.findByUserEmail(userEmail);
        if (userEntity != null) {
            return passwordEncoder.matches(userPassword, userEntity.getUserPassword());
        }
        return false;
    }

    public UserEntity getUserByEmail(String userEmail) {
        return userRepository.findByUserEmail(userEmail);
    }

}
