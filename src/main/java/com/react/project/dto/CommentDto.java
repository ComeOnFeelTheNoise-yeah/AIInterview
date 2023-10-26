package com.react.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    private int commentId;
    private int boardNumber;
    private String userEmail;
    private String commentContent;
    private String commentUserProfile;
    private String commentUserNickname;
    private LocalDateTime commentWriteDate;

}
