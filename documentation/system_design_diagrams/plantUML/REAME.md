# SLFW PlantUML Diagrams

This folder contains all PlantUML diagrams for the Simulated Living Fantasy World (SLFW) project. These diagrams describe class structures, system flows, backend architecture, and other technical components. PlantUML uses a puml code base to render the Class Diagrams, which is useful for version control, such that our UML diagrams are not kept as static images - but as editable code.

---

## For Developers of Project SLFW:

To render or update `.puml` files, ensure the following are installed:

### 1. Java

PlantUML runs on Java. Install from: Java's Developer Kit (JDK)'s latest long supported version from their official website.

Verify installation:
java -version

### 2. Graphviz

Used by PlantUML to generate diagrams. Install from: https://graphviz.org/download

Verify installation:
dot -V

### 3. PlantUML JAR

There is a file called "plantuml-mit-1.2025.3.jar", its a java file that renders the UML diagrams.

See the folder structure below for where to find it.

### 4. VS Code Extension

Install the PLantUML extension by jebbs for quick previews using the online API and VSCode's internal browser.

---

## Folder Structure (folders under "plantUML/." are EXAMPLES ONLY):

    documentation/
    └── system_design_diagrams/
        └── plantUML/
            ├── shared/
            ├── npc/
            ├── world/
            ├── economy/
            ├── backend/
            └── plantuml-mit-1.2025.3.jar

Each subfolder contains domain-specific `.puml` files.

---

## How to Render Diagrams (EXAMPLE ONLY)

To render a single `.puml` file:

    java -jar plantuml-mit-1.2025.3.jar npc/npc_classes.puml

To render all `.puml` files in this folder and subfolders:

    java -jar plantuml-mit-1.2025.3.jar -r .

This generates `.png` files next to each `.puml`.

## How to PREVIEW Diagrams Using the Online API and VS Code (Most Convient Way of Seeing Diagrams)

Assuming you have the PlantUML vs code extension installed:

    When on the .puml file you want to preview, press ALT + D.

---

## Tips

- Place shared types like `Entity` or `Vector2` in `shared/`
- Use `!include` to reuse components across files
- For a live preview, use the PlantUML extension in VS Code:
  https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml

---

## Cleaning Up

To delete all generated `.png` files (optional):

On Unix (Linux/macOS/Git Bash):

    find . -name "*.png" -delete

On Windows (CMD):

    del /S *.png

---

## Updating Diagrams

1. Modify the relevant `.puml` file
2. Re-run the render command
3. Commit both the `.puml` and generated `.png`

---

## Documentation

- PlantUML homepage: https://plantuml.com/
- Syntax reference: https://plantuml.com/guide
