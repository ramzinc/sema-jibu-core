#!/bin/sh
# Set environment variables from the report_server .env
if [ "$(uname)" == "Darwin" ]; then # For Mac
	export $(grep -v '^#' ../.env | xargs -0)
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then # For GNU/Linux
	export $(grep -v '^#' ../.env | xargs -d '\n')
fi
mysqldump -u $DB_USER --password=$DB_PASSWORD -h $DB_HOST --opt $DB_SCHEMA -d --single-transaction | sed 's/ AUTO_INCREMENT=[0-9]*//g' > ../database/create_schema.sql
# Unset environment variables from the report_server .env
unset $(grep -v '^#' ../.env | sed -E 's/(.*)=.*/\1/' | xargs)
