#!/bin/bash

# Script para consultar la base de datos TravelSplit
# Uso: ./consultar-bd.sh [comando]
# Requiere variables de entorno: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_NAME=${DB_NAME:-travelsplit}

# Verificar que la contraseña esté configurada
if [ -z "$DB_PASSWORD" ]; then
    echo "Error: DB_PASSWORD no está configurada. Por favor, configura la variable de entorno."
    echo "Ejemplo: export DB_PASSWORD=tu_contraseña"
    exit 1
fi

# Verificar si Docker está corriendo
if docker ps | grep -q travelsplit-postgres; then
    echo "Conectando a PostgreSQL en Docker..."
    docker exec -it travelsplit-postgres psql -U $DB_USERNAME -d $DB_NAME
else
    echo "Conectando a PostgreSQL local..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME
fi



