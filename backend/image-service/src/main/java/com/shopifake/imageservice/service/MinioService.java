package com.shopifake.imageservice.service;

import io.minio.*;
import io.minio.messages.Item;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.endpoint}")
    private String endpoint;

    public void ensureBucketExists(String bucket) {
        try {
            boolean found = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(bucket)
                            .build()
            );

            if (!found) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucket)
                                .build()
                );
                log.info("Bucket created: {}", bucket);
                setBucketPublicReadPolicy(bucket);
            } else {
                setBucketPublicReadPolicy(bucket);
            }
        } catch (Exception e) {
            log.error("Error while checking/creating bucket: {}", bucket, e);
            throw new RuntimeException("Unable to create bucket", e);
        }
    }

    public String uploadFile(MultipartFile file, String bucket, String objectKey) throws IOException {
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            log.info("File uploaded to bucket {}: {}", bucket, objectKey);
            return objectKey;

        } catch (Exception e) {
            log.error("Error uploading file to bucket {} with key {}", bucket, objectKey, e);
            throw new IOException("Error uploading to MinIO", e);
        }
    }

    public void uploadBytes(byte[] data, String bucket, String objectKey, String contentType) throws IOException {
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .stream(new ByteArrayInputStream(data), data.length, -1)
                            .contentType(contentType)
                            .build()
            );

            log.info("Data uploaded to bucket {}: {}", bucket, objectKey);

        } catch (Exception e) {
            log.error("Error uploading data to bucket {} with key {}", bucket, objectKey, e);
            throw new IOException("Error uploading to MinIO", e);
        }
    }

    public InputStream downloadFile(String bucket, String objectKey) throws IOException {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error downloading file from bucket {} with key {}", bucket, objectKey, e);
            throw new IOException("Error downloading from MinIO", e);
        }
    }

    public void deleteFile(String bucket, String objectKey) throws IOException {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .build()
            );

            log.info("File deleted from bucket {}: {}", bucket, objectKey);

        } catch (Exception e) {
            log.error("Error deleting file from bucket {} with key {}", bucket, objectKey, e);
            throw new IOException("Error deleting from MinIO", e);
        }
    }

    public String getPublicUrl(String bucket, String objectKey) {
        String publicUrl = String.format("%s/%s/%s", endpoint, bucket, objectKey);
        log.debug("Public URL generated: {}", publicUrl);
        return publicUrl;
    }

    public void setBucketPublicReadPolicy(String bucket) {
        try {
            String policy = String.format("""
                {
                  "Version": "2012-10-17",
                  "Statement": [
                    {
                      "Effect": "Allow",
                      "Principal": {"AWS": ["*"]},
                      "Action": ["s3:GetObject"],
                      "Resource": ["arn:aws:s3:::%s/*"]
                    }
                  ]
                }
                """, bucket);

            minioClient.setBucketPolicy(
                SetBucketPolicyArgs.builder()
                    .bucket(bucket)
                    .config(policy)
                    .build()
            );

            log.info("Bucket {} configured in public mode (read-only)", bucket);

        } catch (Exception e) {
            log.warn("Unable to configure bucket {} as public. Configure it manually via MinIO Console.", bucket, e);
        }
    }

    public void deleteFolder(String bucket, String folderPath) throws IOException {
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(
                    ListObjectsArgs.builder()
                            .bucket(bucket)
                            .prefix(folderPath)
                            .recursive(true)
                            .build()
            );

            for (Result<Item> result : results) {
                Item item = result.get();
                minioClient.removeObject(
                        RemoveObjectArgs.builder()
                                .bucket(bucket)
                                .object(item.objectName())
                                .build()
                );
                log.debug("Deleted MinIO object from bucket {}: {}", bucket, item.objectName());
            }

            log.info("Folder deleted from MinIO bucket {}: {}", bucket, folderPath);

        } catch (Exception e) {
            log.error("Error deleting folder from MinIO bucket {} with path {}", bucket, folderPath, e);
            throw new IOException("Error deleting folder from MinIO", e);
        }
    }
}

