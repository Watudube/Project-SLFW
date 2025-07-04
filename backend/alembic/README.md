Generic single-database configuration.

<h3>Alembic Commands (Run from /backend)</h3>

To create a migration script with automatic SQL generation
```
alembic revision --autogenerate -m "alembic revision message"
```


To apply the migration script to the database
```
alembic upgrade head
```


To roll back the last migration
```
alembic downgrade -1
```


To roll back to an arbitrary migration
```
alembic downgrade {revision-id}
```


To roll forward to next migration
```
alembic upgrade +1
```


To nuke the entire database (roll back to first migration)
```
alembic downgrade base
```


You can check your work using the postgreSQL CLI, psql. From psql you can run
any raw SQL queries directly onto the database. There are also useful commands
such as \dt to view all tables, \d table-name to view rows in a specific table
and \q to exit.
```
docker exec -ti container-name psql -U postgres -d db-name
```


<h3>Alembic Files and Folders</h3>
In this project, all alembic files and folders are in their standard form
except env.py. Migration scripts are stored in the version folder.