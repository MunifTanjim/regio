FROM postgres:11.2-alpine

COPY docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/

ENV PGDATA=/var/lib/postgresql/data/regio
ENV POSTGRES_DB=regio

VOLUME [ "/var/lib/postgresql/data/regio" ]
