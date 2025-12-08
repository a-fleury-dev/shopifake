package com.shopifake.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class KeycloakUserInfo {
    @JsonProperty("sub")
    private String sub;

    @JsonProperty("preferred_username")
    private String preferredUsername;

    @JsonProperty("email")
    private String email;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;
}

