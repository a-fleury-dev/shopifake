package com.shopifake.imageservice.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.shopifake.imageservice.model.Image;
import com.shopifake.imageservice.repository.ImageRepository;
import com.shopifake.imageservice.service.ImageService;
import com.shopifake.imageservice.service.MinioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class ImageSeeder implements CommandLineRunner {

    private final ImageRepository imageRepository;
    private final MinioService minioService;
    private final ImageService imageService;

    @Override
    public void run(String... args) {
        log.info("🌱 Starting image seeding...");

        ensureBucketsExist();
        cleanExistingData();
        createSeedImages();

        log.info("✅ Image seeding completed successfully!");
    }

    private void ensureBucketsExist() {
        minioService.ensureBucketExists("store-banners");
        minioService.ensureBucketExists("blog-images");
        minioService.ensureBucketExists("product-variants");
    }

    private void cleanExistingData() {
        List<Image> existingImages = imageRepository.findAll();

        if (!existingImages.isEmpty()) {
            for (Image image : existingImages) {
                try {
                    minioService.deleteFile(image.getBucketName(), image.getObjectKey());
                } catch (Exception e) {
                    // Silently ignore MinIO deletion errors during cleanup
                }
            }
            imageRepository.deleteAll();
        }
    }

    private void createSeedImages() {
        try {
            loadImagesFromFolder("seed-dev/store-banners", Image.EntityType.STORE_BANNER);
            loadBlogImagesFromFolder("seed-dev/blog-images");
            loadVariantImagesFromFolder("seed-dev/product-variants");

            long count = imageRepository.count();
            if (count > 0) {
                log.info("✅ {} seed images created successfully", count);
            } else {
                log.warn("⚠️ No seed images found. Add images to src/main/resources/seed-dev/");
            }
        } catch (Exception e) {
            log.error("❌ Error creating seed images: {}", e.getMessage());
            throw new RuntimeException("Image seeding failed", e);
        }
    }

    private void loadImagesFromFolder(String folderPath, Image.EntityType entityType) {
        try {
            var resource = getClass().getClassLoader().getResource(folderPath);
            if (resource == null) return;

            var folder = new File(resource.toURI());
            var files = folder.listFiles((dir, name) ->
                name.toLowerCase().endsWith(".jpg") ||
                name.toLowerCase().endsWith(".jpeg") ||
                name.toLowerCase().endsWith(".png") ||
                name.toLowerCase().endsWith(".webp")
            );

            if (files == null || files.length == 0) return;

            int index = 1;
            for (var file : files) {
                try {
                    byte[] imageData = java.nio.file.Files.readAllBytes(file.toPath());
                    String contentType = determineContentType(file.getName());
                    String storeId = "store-" + String.format("%03d", index);
                    uploadSeedImage(entityType, storeId, file.getName(), imageData, contentType, null, null, null);
                    index++;
                } catch (Exception e) {
                    log.error("❌ Failed to load {}: {}", file.getName(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("❌ Error loading images from {}: {}", folderPath, e.getMessage());
        }
    }

    private void loadBlogImagesFromFolder(String basePath) {
        try {
            var resource = getClass().getClassLoader().getResource(basePath);
            if (resource == null) return;

            var baseFolder = new File(resource.toURI());
            var storeFolders = baseFolder.listFiles(File::isDirectory);
            if (storeFolders == null || storeFolders.length == 0) return;

            for (var storeFolder : storeFolders) {
                String storeId = storeFolder.getName();
                var files = storeFolder.listFiles((dir, name) ->
                    name.toLowerCase().endsWith(".jpg") ||
                    name.toLowerCase().endsWith(".jpeg") ||
                    name.toLowerCase().endsWith(".png") ||
                    name.toLowerCase().endsWith(".webp")
                );

                if (files == null || files.length == 0) continue;
                java.util.Arrays.sort(files);

                for (var file : files) {
                    try {
                        byte[] imageData = java.nio.file.Files.readAllBytes(file.toPath());
                        String contentType = determineContentType(file.getName());
                        uploadSeedImage(Image.EntityType.BLOG_IMAGE, storeId, file.getName(),
                                       imageData, contentType, null, null, null);
                    } catch (Exception e) {
                        log.error("❌ Failed to load blog image {}: {}", file.getName(), e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            log.error("❌ Error loading blog images from {}: {}", basePath, e.getMessage());
        }
    }

    private void loadVariantImagesFromFolder(String basePath) {
        try {
            var resource = getClass().getClassLoader().getResource(basePath);
            if (resource == null) return;

            var baseFolder = new File(resource.toURI());
            var storeFolders = baseFolder.listFiles(File::isDirectory);
            if (storeFolders == null || storeFolders.length == 0) return;

            for (var storeFolder : storeFolders) {
                String storeId = storeFolder.getName();
                var productFolders = storeFolder.listFiles(File::isDirectory);
                if (productFolders == null) continue;

                for (var productFolder : productFolders) {
                    String productId = productFolder.getName();
                    var variantFolders = productFolder.listFiles(File::isDirectory);
                    if (variantFolders == null) continue;

                    for (var variantFolder : variantFolders) {
                        String variantId = variantFolder.getName();
                        loadVariantImages(storeId, productId, variantId, variantFolder);
                    }
                }
            }
        } catch (Exception e) {
            log.error("❌ Error loading variant images: {}", e.getMessage());
        }
    }

    private void loadVariantImages(String storeId, String productId, String variantId, File variantFolder) {
        var files = variantFolder.listFiles((dir, name) ->
            name.toLowerCase().endsWith(".jpg") ||
            name.toLowerCase().endsWith(".jpeg") ||
            name.toLowerCase().endsWith(".png") ||
            name.toLowerCase().endsWith(".webp")
        );

        if (files == null || files.length == 0) return;

        java.util.Arrays.sort(files);

        int displayOrder = 0;
        for (var file : files) {
            try {
                byte[] imageData = java.nio.file.Files.readAllBytes(file.toPath());
                String contentType = determineContentType(file.getName());
                uploadSeedImage(Image.EntityType.VARIANT_IMAGE, storeId, file.getName(),
                               imageData, contentType, productId, variantId, displayOrder);
                displayOrder++;
            } catch (Exception e) {
                log.error("❌ Failed to load variant image {}: {}", file.getName(), e.getMessage());
            }
        }
    }

    private String determineContentType(String fileName) {
        String lowerName = fileName.toLowerCase();
        if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowerName.endsWith(".png")) {
            return "image/png";
        } else if (lowerName.endsWith(".webp")) {
            return "image/webp";
        }
        return "image/jpeg";
    }

    private void uploadSeedImage(Image.EntityType entityType, String storeId, String fileName,
                                 byte[] imageData, String contentType, String productId,
                                 String variantId, Integer displayOrder) {
        try {
            MultipartFile multipartFile = new SeedMultipartFile(
                    "file",
                    fileName,
                    contentType,
                    imageData
            );

            imageService.uploadImage(multipartFile, entityType, storeId, productId, variantId, displayOrder);
        } catch (Exception e) {
            log.error("❌ Failed to upload {}: {}", fileName, e.getMessage());
        }
    }
}

