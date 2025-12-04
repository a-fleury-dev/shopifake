package com.shopifake.auth.service;

import com.shopifake.auth.dto.*;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import jakarta.ws.rs.core.Response;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final Keycloak keycloak;
    private final RestTemplate restTemplate;

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    public AuthResponse login(LoginRequest request) {
        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", "shopifake");
        body.add("username", request.getUsername());
        body.add("password", request.getPassword());
        body.add("scope", "openid profile email");

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<KeycloakTokenResponse> response = restTemplate.postForEntity(
                    tokenUrl, entity, KeycloakTokenResponse.class);
            KeycloakTokenResponse tokenResponse = response.getBody();

            if (tokenResponse == null) {
                throw new RuntimeException("No response from authentication server");
            }

            return AuthResponse.builder()
                    .accessToken(tokenResponse.getAccessToken())
                    .refreshToken(tokenResponse.getRefreshToken())
                    .expiresIn(tokenResponse.getExpiresIn())
                    .tokenType(tokenResponse.getTokenType())
                    .scope(tokenResponse.getScope())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public Boolean logout(LogoutRequest request) {
        String logoutUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/logout";


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBearerAuth(request.getAccessToken());

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", "shopifake");
        body.add("refresh_token", request.getRefreshToken());

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            HttpStatusCode statusCode =  restTemplate.postForEntity(
                    logoutUrl, entity, Object.class).getStatusCode();
            log.info("Logout status code from keycloak: {}", statusCode);
            return statusCode == HttpStatus.NO_CONTENT;

        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public UserResponse register(RegisterRequest request) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();

            UserRepresentation user = new UserRepresentation();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEnabled(true);
            user.setEmailVerified(true);

            try (Response response = usersResource.create(user)) {
                if (response.getStatus() != 201) {
                    throw new RuntimeException("Failed to create user: " + response.getStatusInfo());
                }

                String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

                CredentialRepresentation credential = new CredentialRepresentation();
                credential.setType(CredentialRepresentation.PASSWORD);
                credential.setValue(request.getPassword());
                credential.setTemporary(false);

                usersResource.get(userId).resetPassword(credential);

                return UserResponse.builder()
                        .id(userId)
                        .username(request.getUsername())
                        .email(request.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .enabled(true)
                        .build();
            }

        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public UserResponse getUserInfo(String token) {
        String userInfoUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<KeycloakUserInfo> response = restTemplate.exchange(
                    userInfoUrl, HttpMethod.GET, entity, KeycloakUserInfo.class);
            KeycloakUserInfo userInfo = response.getBody();

            if (userInfo == null) {
                throw new RuntimeException("No user info received");
            }

            return UserResponse.builder()
                    .id(userInfo.getSub())
                    .username(userInfo.getPreferredUsername())
                    .email(userInfo.getEmail())
                    .firstName(userInfo.getGivenName())
                    .lastName(userInfo.getFamilyName())
                    .enabled(true)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get user info: " + e.getMessage());
        }
    }

    public KeycloakTokenResponse refreshToken(RefreshRequest request) {
        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBearerAuth(request.getAccessToken());

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", "shopifake");
        body.add("refresh_token", request.getRefreshToken());

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<KeycloakTokenResponse> response = restTemplate.postForEntity(
                    tokenUrl, entity, KeycloakTokenResponse.class);
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new BadRequestException("Keycloak returned an error: STATUS: " + response.getStatusCode());
            }
            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Failed to get user info: " + e.getMessage());
        }
    }
}
