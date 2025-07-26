// Dependencies:
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components:
import CreateAccountModal from "../components/CreateAccountModal";

// Contexts:
import { UserContext } from "../contexts/UserContext";

// Styles:
import "./LoginPage.css";

export default function LoginPage() {
  const { login, userToken, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect to game if user is already logged in.
  useEffect(() => {
    if (userToken && !isLoading) {
      navigate("/game");
    }
  }, [userToken, isLoading, navigate]);

  /**
   * Handle input field changes.
   * @param {Event} e - Input change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing.
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validate the login form.
   * @returns {boolean} - True if form is valid, false otherwise.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // No errors means form is valid.
  };

  /**
   * Handle login form submission.
   * @param {Event} e - Form submit event.
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // Navigation will happen automatically via useEffect.
    } catch (error) {
      if (error.message.includes("Incorrect username or password")) {
        setErrors({ general: "Incorrect username or password" });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    }
  };

  /**
   * Handle create account link click.
   * @param {Event} e - Click event.
   */
  const handleCreateAccountClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  /**
   * Handle modal close.
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-headers">
        <h1>Project SLFW</h1>
        <h2>Login Portal</h2>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        {errors.general && <div className="error-message general-error">{errors.general}</div>}

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          autoComplete="username"
          disabled={isLoading}
        />
        {errors.username && <div className="error-message">{errors.username}</div>}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          autoComplete="current-password"
          disabled={isLoading}
        />
        {errors.password && <div className="error-message">{errors.password}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? Create one{" "}
          <a href="#" onClick={handleCreateAccountClick}>
            here
          </a>
          .
        </p>
      </form>

      <CreateAccountModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
