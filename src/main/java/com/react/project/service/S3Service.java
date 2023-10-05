package com.react.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Instant;

@Service
public class S3Service {

    @Autowired
    private S3Client s3Client;

    public String uploadFile(MultipartFile file) {
        try {
            File fileObj = convertMultiPartToFile(file);
            String fileName = generateFileName(file);

            String bucketName = "aiinterview";
            s3Client.putObject(PutObjectRequest.builder().bucket(bucketName).key(fileName).build(),
                    RequestBody.fromFile(fileObj));

            fileObj.delete();
            return fileName;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 이 메소드는 MultipartFile을 일반 File 객체로 변환합니다. S3 SDK가 MultipartFile을 직접 지원하지 않기 때문에 변환이 필요합니다.
    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        }
        return convertedFile;
    }

    // 이 메소드는 업로드된 파일에 대한 고유한 파일 이름을 생성합니다.
    // 여기서는 원래의 파일 이름 앞에 현재의 타임스탬프를 추가하여 파일 이름을 생성합니다.
    // 이렇게 하면 같은 이름의 파일이 여러 번 업로드되더라도 각 파일에 대한 고유한 이름이 생성됩니다.
    private String generateFileName(MultipartFile file) {
        return Instant.now().toEpochMilli() + "_" + file.getOriginalFilename();
    }


}

