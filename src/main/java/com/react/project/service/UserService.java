package com.react.project.service;

import com.react.project.dto.PatchUserDto;
import com.react.project.dto.PatchUserResponseDto;
import com.react.project.dto.ResponseDto;
import com.react.project.entity.UserEntity;
import com.react.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public ResponseDto<PatchUserResponseDto> patchUser(PatchUserDto dto, String userEmail){
        UserEntity userEntity = null;
        String userNickname = dto.getUserNickname();
        String userProfile = dto.getUserProfile();

        try{
            userEntity = userRepository.findByUserEmail(userEmail);
            if(userEntity == null){
                return ResponseDto.setFailed("Does Not Exist User");
            }
            userEntity.setUserNickname(userNickname);
            userEntity.setUserProfile(userProfile);

            userRepository.save(userEntity);
        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.setFailed("Database Error");
        }

        userEntity.setUserPassword("");
        PatchUserResponseDto patchUserResponseDto = new PatchUserResponseDto(userEntity);
        return ResponseDto.setSuccess("Success", patchUserResponseDto);
    }
}
