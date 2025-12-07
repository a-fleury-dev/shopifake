FROM keycloak/keycloak:26.0.7

USER root

# Optional: copy themes, providers and imports if they exist
COPY ./keycloak-data/import /opt/keycloak/import

# Adjust permissions to let keycloak read/write its files
RUN chown -R keycloak:keycloak /opt/keycloak

USER keycloak

# Build an optimized Keycloak image
RUN /opt/keycloak/bin/kc.sh build

# Environment variable to control the mode (dev or prod)
ENV KEYCLOAK_MODE=dev

EXPOSE 8080

# Use a startup script to handle import and start
COPY --chown=keycloak:keycloak <<'EOF' /opt/keycloak/bin/startup.sh
#!/bin/sh
set -e

# Import realm if it doesn't exist
if [ -f /opt/keycloak/import/realm-export.json ]; then
  echo "Importing realm..."
  /opt/keycloak/bin/kc.sh import --file /opt/keycloak/import/realm-export.json --override false --optimized || true
fi

# Start Keycloak
if [ "$KEYCLOAK_MODE" = "prod" ]; then
  exec /opt/keycloak/bin/kc.sh start --optimized
else
  exec /opt/keycloak/bin/kc.sh start-dev
fi
EOF

RUN chmod +x /opt/keycloak/bin/startup.sh

ENTRYPOINT ["/opt/keycloak/bin/startup.sh"]
