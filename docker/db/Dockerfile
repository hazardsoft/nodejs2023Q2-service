FROM postgres:15-alpine3.18
ENV PGLOG /var/lib/postgresql/log
RUN mkdir -p "$PGLOG" && chown -R postgres:postgres "$PGLOG" && chmod 1777 "$PGLOG"
VOLUME /var/lib/postgresql/log