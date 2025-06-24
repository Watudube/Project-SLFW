// Importing Dependencies:

// Importing Components:
import PhaserComponent from "../components/PhaserComponent";

// Importing Styles:
import "./HomePage.css";

/**
 * Represents the Home Page of the application, which serves as the main entry point for users.
 * @returns Home Page Component
 */
export default function HomePage() {
  return (
    <div className="home-page-container">
      <div className="game-title-container">
        <h1>Project-SLFW</h1>
        <p>
          <i>Name Pending</i>
        </p>
      </div>
      <div className="gui-container">
        <PhaserComponent />
      </div>
      <div className="insrtuctions-container">
        <h3>
          <u>Instructions:</u>
        </h3>
        <p>w - Move north.</p>
        <p>a - Move west.</p>
        <p>s - Move south.</p>
        <p>d - Move east.</p>
      </div>
    </div>
  );
}
