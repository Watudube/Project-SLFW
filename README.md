# Project Summary

At its largest scale, the Simulated Living Fantasy World (SLFW) game will simulate, a living fantasy world, where all NPC entities and players can mutually affect and interact one another. There would be a persistent sandbox and framework for NPCs to have their own motivations and objectives, and the game world itself simulates ecology and an economy. Economies and other systems will follow the principles of supply and demand, where there will be “no free lunch”. Consequently, player actions will have a direct effect on the state of the world and can shape it based on the established systems of that world. State changes in the game world will occur and be reflected to the player in real-time.

## TODO for developers:

- Once the python side of the project is in a testable state, check the Dockerfile and run.sh is compatible.
- Once the the python and react side of the project is both in a testable state, check nginx.conf is compatible.

## Building the test enviroment using Docker:

Run the following commands:

```
docker build -t slfw-allinone .
docker run -p 80:80 -p 8000:8000 -p 5432:5432 -p 6379:6379 -v $(pwd)/backend:/app/backend slfw-allinone
```
