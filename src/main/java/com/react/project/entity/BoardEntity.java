package com.react.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Board")
@Table(name = "Board")
public class BoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int boardNumber;
    private String boardTitle;
    private String boardContent;
    private String boardImage;
    private String boardWriterEmail;
    private String boardWriterProfile;
    private String boardWriterNickname;
    private String boardWriteDate;
    private int boardClickCount;
    private int boardLikeCount;
    private int boardCommentCount;
}
