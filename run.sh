#!/bin/bash

# Initialize PostgreSQL if not already done
if [ ! -s "/var/lib/postgresql/data/PG_VERSION" ]; then
  echo "Initializing PostgreSQL..."
  su postgres -c "/usr/lib/postgresql/*/bin/initdb -D /var/lib/postgresql/data"
fi

# Start supervisor to run all services
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf