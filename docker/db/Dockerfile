FROM postgres:15-alpine3.18
EXPOSE 5432
CMD ["postgres", \
    "-c", "log_statement=all", \
    "-c", "log_destination=stderr", \
    "-c", "logging_collector=on", \
    "-c", "log_directory=log", \
    "-c", "log_filename=postgresql-%Y-%m-%d_%H%M%S.log", \
    "-c", "log_min_error_statement=error"]