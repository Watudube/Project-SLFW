<h2>Backend Commands</h2>

<h3>Ensure Dependencies are Installed</h3>

From backend folder

To start python virtual environment
```
./.venv/Scripts/Activate
```
To install dependencies
```
pip install -r ./requirements.txt
```
To exit virtual environment (not necessary)
```
deactivate
```

<h3>Manage Docker Containers</h3>

From project root

To create containers (optional -d param for cleaner output)
```
docker compose up
```

To stop containers
ctrl c

To destroy containers
```
docker compose down
```