# SLFW Frontend

This is the frontend client for the Simulated Living Fantasy World (SLFW) project. It combines React (for interface and UI logic) with Phaser 3 (for 2D canvas-based game rendering). This client connects to the SLFW backend for real-time gameplay and world updates.

## REQUIREMENTS

To run this project locally, you’ll need the following installed:

1. Node.js:
   Download from https://nodejs.org/. This also installs npm (Node Package Manager).
   Recommended version: Node.js v18.x or later (LTS)

To verify installation:

```
node -v
npm -v
```

## GETTING STARTED (DEVELOPMENT)

1. Install dependencies of the frontend project:

Ensure you are in the 'Project-SLFW/frontend' folder.

```
npm install
```

2. Start the development server:

```
npm run dev
```

This starts a local Vite server (usually at http://localhost:5173/). It supports hot reload while developing (file saves refresh the browser).

## BUILDING FOR PRODUCTION

To build the production-ready frontend:

```
npm run build
```

This outputs static files to the dist/ folder. You can serve this folder with a static server (like Nginx).

To preview the production build locally:

```
npm run preview
```

## CONTRIBUTORS

- Hai Peng Kevin Goh – Frontend Development Lead, UI/UX Design, Systems Design
- Marshall Bullis – Backend Development Lead, Deployment Architectur

## LICENSE

This project is under development for learning, experimentation, and portfolio use. Licensing will be determined at a later stage.
