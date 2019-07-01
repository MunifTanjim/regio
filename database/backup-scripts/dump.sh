#!/usr/bin/env bash

_DB_SERVICE_NAME="database"
_DB_USER=${POSTGRES_USER:-"postgres"}
_DB_PASSWORD=${POSTGRES_PASSWORD:-"postgres"}
_DB_NAME=${POSTGRES_DB:-"regio"}

_DB_DUMP_DIR=${1}

PGPASSWORD=${_DB_PASSWORD} docker-compose exec ${_DB_SERVICE_NAME} \
  pg_dump -U ${_DB_USER} ${_DB_NAME} > "${_DB_DUMP_DIR}/$(date +%s)-${_DB_NAME}.sql"
