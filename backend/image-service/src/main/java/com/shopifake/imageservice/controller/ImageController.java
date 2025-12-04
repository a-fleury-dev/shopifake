package com.shopifake.imageservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.shopifake.imageservice.dto.ErrorResponse;
import com.shopifake.imageservice.dto.ImageResponse;
import com.shopifake.imageservice.dto.UploadResponse;
import com.shopifake.imageservice.model.Image;
import com.shopifake.imageservice.service.ImageService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Image Management", description = "API for managing store banners, blog images, and product variant images")
public class ImageController {

    private final ImageService imageService;

    @PostMapping(value = "/upload/store-banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Upload a store banner",
            description = "Upload a store banner image to MinIO and save metadata. Only one banner per store."
    )
    @ApiResponse(responseCode = "200", description = "Banner uploaded successfully")
    @ApiResponse(responseCode = "400", description = "Invalid file",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public ResponseEntity<UploadResponse> uploadStoreBanner(
            @Parameter(description = "Image file to upload") @RequestParam("file") MultipartFile file,
            @Parameter(description = "Store ID") @RequestParam("storeId") String storeId
    ) {
        try {
            UploadResponse response = imageService.uploadImage(
                    file,
                    Image.EntityType.STORE_BANNER,
                    storeId,
                    null,
                    null,
                    null
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Store banner validation failed for store {}: {}", storeId, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Failed to upload store banner for store {}", storeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/upload/blog-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Upload a blog image",
            description = "Upload an image for the store's blog. Each store has one blog."
    )
    @ApiResponse(responseCode = "200", description = "Blog image uploaded successfully")
    @ApiResponse(responseCode = "400", description = "Invalid file",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public ResponseEntity<UploadResponse> uploadBlogImage(
            @Parameter(description = "Image file to upload") @RequestParam("file") MultipartFile file,
            @Parameter(description = "Store ID") @RequestParam("storeId") String storeId
    ) {
        try {
            UploadResponse response = imageService.uploadImage(
                    file,
                    Image.EntityType.BLOG_IMAGE,
                    storeId,
                    null,
                    null,
                    null
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Blog image validation failed for store {}: {}", storeId, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Failed to upload blog image for store {}", storeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/upload/variant-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Upload a product variant image",
            description = "Upload an image for a product variant. "
                    + "Multiple images can be uploaded per variant with display order."
    )
    @ApiResponse(responseCode = "200", description = "Variant image uploaded successfully")
    @ApiResponse(responseCode = "400", description = "Invalid file or missing parameters",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public ResponseEntity<UploadResponse> uploadVariantImage(
            @Parameter(description = "Image file to upload") @RequestParam("file") MultipartFile file,
            @Parameter(description = "Store ID") @RequestParam("storeId") String storeId,
            @Parameter(description = "Product ID") @RequestParam("productId") String productId,
            @Parameter(description = "Variant ID") @RequestParam("variantId") String variantId,
            @Parameter(description = "Display order (0 = primary image)")
            @RequestParam(value = "displayOrder", required = false, defaultValue = "0") Integer displayOrder
    ) {
        try {
            UploadResponse response = imageService.uploadImage(
                    file,
                    Image.EntityType.VARIANT_IMAGE,
                    storeId,
                    productId,
                    variantId,
                    displayOrder
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Variant image validation failed for variant {}: {}", variantId, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Failed to upload variant image for variant {}", variantId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get image metadata",
            description = "Returns image information by its ID"
    )
    @ApiResponse(responseCode = "200", description = "Image metadata")
    @ApiResponse(responseCode = "404", description = "Image not found")
    public ResponseEntity<ImageResponse> getImage(
            @Parameter(description = "Image ID") @PathVariable UUID id
    ) {
        try {
            ImageResponse response = imageService.getImageById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Failed to retrieve image metadata: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @Operation(
            summary = "List all images",
            description = "Returns all non-deleted images"
    )
    @ApiResponse(responseCode = "200", description = "List of images")
    public ResponseEntity<List<ImageResponse>> getAllImages() {
        List<ImageResponse> images = imageService.getAllImages();
        return ResponseEntity.ok(images);
    }

    @GetMapping("/store/{storeId}/banner")
    @Operation(
            summary = "Get store banner",
            description = "Returns the banner image of a store"
    )
    @ApiResponse(responseCode = "200", description = "Store banner image")
    @ApiResponse(responseCode = "404", description = "Banner not found")
    public ResponseEntity<ImageResponse> getStoreBanner(
            @Parameter(description = "Store ID") @PathVariable String storeId
    ) {
        ImageResponse image = imageService.getStoreBanner(storeId);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(image);
    }

    @GetMapping("/store/{storeId}/blog")
    @Operation(
            summary = "Get blog images",
            description = "Returns all blog images for a store"
    )
    @ApiResponse(responseCode = "200", description = "List of blog images")
    public ResponseEntity<List<ImageResponse>> getBlogImages(
            @Parameter(description = "Store ID") @PathVariable String storeId
    ) {
        List<ImageResponse> images = imageService.getBlogImages(storeId);
        return ResponseEntity.ok(images);
    }

    @GetMapping("/store/{storeId}")
    @Operation(
            summary = "Get all images of a store",
            description = "Returns all images (banner, blog, products) belonging to a store"
    )
    @ApiResponse(responseCode = "200", description = "List of store images")
    public ResponseEntity<List<ImageResponse>> getStoreImages(
            @Parameter(description = "Store ID") @PathVariable String storeId
    ) {
        List<ImageResponse> images = imageService.getStoreImages(storeId);
        return ResponseEntity.ok(images);
    }

    @GetMapping("/product/{productId}")
    @Operation(
            summary = "Get product images",
            description = "Returns all images for a product (all variants)"
    )
    @ApiResponse(responseCode = "200", description = "List of product images")
    public ResponseEntity<List<ImageResponse>> getProductImages(
            @Parameter(description = "Product ID") @PathVariable String productId
    ) {
        List<ImageResponse> images = imageService.getProductImages(productId);
        return ResponseEntity.ok(images);
    }

    @GetMapping("/variant/{variantId}")
    @Operation(
            summary = "Get variant images",
            description = "Returns all images for a product variant, ordered by display order"
    )
    @ApiResponse(responseCode = "200", description = "List of variant images")
    public ResponseEntity<List<ImageResponse>> getVariantImages(
            @Parameter(description = "Variant ID") @PathVariable String variantId
    ) {
        List<ImageResponse> images = imageService.getVariantImages(variantId);
        return ResponseEntity.ok(images);
    }

    @GetMapping("/variant/{variantId}/primary")
    @Operation(
            summary = "Get primary variant image",
            description = "Returns the primary image (display_order = 0) of a product variant"
    )
    @ApiResponse(responseCode = "200", description = "Primary variant image")
    @ApiResponse(responseCode = "404", description = "Primary image not found")
    public ResponseEntity<ImageResponse> getPrimaryVariantImage(
            @Parameter(description = "Variant ID") @PathVariable String variantId
    ) {
        ImageResponse image = imageService.getPrimaryVariantImage(variantId);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(image);
    }

    @GetMapping("/{id}/download")
    @Operation(
            summary = "Download an image",
            description = "Download image file from MinIO"
    )
    @ApiResponse(responseCode = "200", description = "Image file", content = @Content(mediaType = "image/*"))
    @ApiResponse(responseCode = "404", description = "Image not found")
    public ResponseEntity<InputStreamResource> downloadImage(
            @Parameter(description = "Image ID") @PathVariable UUID id
    ) {
        try {
            ImageResponse imageInfo = imageService.getImageById(id);
            InputStream inputStream = imageService.downloadImage(id);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(imageInfo.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + imageInfo.getFileName() + "\"")
                    .body(new InputStreamResource(inputStream));

        } catch (RuntimeException e) {
            log.error("Image download failed, not found in database: {}", id);
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            log.error("Image download failed, MinIO error for image: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete an image",
            description = "Delete an image from MinIO and mark as deleted in database (soft delete)"
    )
    @ApiResponse(responseCode = "204", description = "Image deleted successfully")
    @ApiResponse(responseCode = "404", description = "Image not found")
    public ResponseEntity<Void> deleteImage(
            @Parameter(description = "Image ID") @PathVariable UUID id
    ) {
        try {
            imageService.deleteImage(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Cannot delete image, not found in database: {}", id);
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            log.error("Image deletion failed, MinIO error for image: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/product/{productId}")
    @Operation(
            summary = "Delete all product images",
            description = "Delete all images associated with a product (all variants)"
    )
    @ApiResponse(responseCode = "204", description = "Product images deleted successfully")
    public ResponseEntity<Void> deleteProductImages(
            @Parameter(description = "Product ID") @PathVariable String productId
    ) {
        try {
            imageService.deleteProductImages(productId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            log.error("Failed to delete product images: {}", productId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/variant/{variantId}")
    @Operation(
            summary = "Delete all variant images",
            description = "Delete all images associated with a product variant"
    )
    @ApiResponse(responseCode = "204", description = "Variant images deleted successfully")
    public ResponseEntity<Void> deleteVariantImages(
            @Parameter(description = "Variant ID") @PathVariable String variantId
    ) {
        try {
            imageService.deleteVariantImages(variantId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            log.error("Failed to delete variant images: {}", variantId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/store/{storeId}")
    @Operation(
            summary = "Delete all images of a store",
            description = "Delete all images (banner, blog, products) belonging to a store from MinIO and database"
    )
    @ApiResponse(responseCode = "204", description = "Store images deleted successfully")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<Void> deleteAllStoreImages(
            @Parameter(description = "Store ID") @PathVariable String storeId
    ) {
        try {
            imageService.deleteAllStoreImages(storeId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            log.error("Failed to delete all images for store: {}", storeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    @Operation(
            summary = "Health check",
            description = "Check if the service is running properly"
    )
    @ApiResponse(responseCode = "200", description = "Service operational")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Image Service is running");
    }
}

