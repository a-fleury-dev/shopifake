FROM quay.io/keycloak/keycloak:26.4.0

USER root

# Optional: copy themes, providers and imports if they exist
COPY ./keycloak-data/import /opt/keycloak/import

# Adjust permissions to let keycloak read/write its files
RUN chown -R keycloak:keycloak /opt/keycloak

USER keycloak

# Environment variable to control the mode (dev or prod)
# dev -> runs 'start-dev'
# prod -> runs 'start'
ENV KEYCLOAK_MODE=dev
ENV IMPORT_FILE_PATH=/opt/keycloak/import/realm-export.json
ENV OVERWRITE_EXISTING_REALM=false

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "/opt/keycloak/bin/kc.sh import --file \"$IMPORT_FILE_PATH\" --override \"$OVERWRITE_EXISTING_REALM\" || true \
 && if [ \"$KEYCLOAK_MODE\" = \"prod\" ]; then exec /opt/keycloak/bin/kc.sh start; else exec /opt/keycloak/bin/kc.sh start-dev; fi"]
