package com.react.project.entity;

import com.react.project.dto.SignUpDto;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "User")
@Table(name = "User")
public class UserEntity {
    @Id
    private String userEmail;
    private String userPassword;
    private String userNickname;
    private String userName;
    private String userPhoneNumber;
    private String userAddress;
    private String userProfile;

    public UserEntity(SignUpDto dto){
        this.userEmail = dto.getUserEmail();
        this.userPassword = dto.getUserPassword();
        this.userNickname = dto.getUserNickname();
        this.userName = dto.getUserName();
        this.userAddress = dto.getUserAddress() + " " + dto.getUserAddressDetail();
        this.userPhoneNumber = dto.getUserPhoneNumber();
    }
}
