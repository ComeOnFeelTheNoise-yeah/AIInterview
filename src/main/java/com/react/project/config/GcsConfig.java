package com.react.project.config;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.UUID;

@Configuration
public class GcsConfig {

    private static final Logger logger = LoggerFactory.getLogger(GcsConfig.class);

    @Value("${gcs.bucket.name}")
    private String bucketName;

    @Value("${gcs.credentials.path}")
    private String credentialsPath;

    public String uploadFile(MultipartFile file) throws IOException {
        try {
            Resource resource = new ClassPathResource(credentialsPath.replace("classpath:", ""));
            Storage storage = StorageOptions.newBuilder()
                    .setCredentials(ServiceAccountCredentials.fromStream(resource.getInputStream()))
                    .build()
                    .getService();

            String fileName = "profile/" + UUID.randomUUID().toString();
            BlobId blobId = BlobId.of(bucketName, fileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

            Blob blob = storage.create(blobInfo, file.getBytes());
            logger.info("Media Link: " + blob.getMediaLink());
            if (blob != null) {
                return blob.getMediaLink();
            }
        } catch (Exception e) {
            logger.error("Error while uploading file to GCS", e);
        }
        return null;
    }
}
