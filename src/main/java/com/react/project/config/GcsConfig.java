package com.react.project.config;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.UUID;

@Configuration
public class GcsConfig {

    @Value("${gcs.bucket.name}")
    private String bucketName;

    @Value("${gcs.credentials.path}")
    private String credentialsPath;

    public String uploadFile(MultipartFile file) throws IOException {
        Storage storage = StorageOptions.newBuilder()
                .setCredentials(ServiceAccountCredentials.fromStream(new FileInputStream(credentialsPath)))
                .build()
                .getService();

        String fileName = "profile/" + UUID.randomUUID().toString();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

        Blob blob = storage.create(blobInfo, file.getBytes());
        if (blob != null) {
            return blob.getMediaLink();
        }
        return null;
    }
}

