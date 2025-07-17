// Importing Dependencies:
import { useState, useContext } from "react";

// Importing Contexts:
import { UserContext } from "../contexts/UserContext";

// Importing Styles:
import "./CreateAccountModal.css";

/**
 * Modal component for creating a new user account.
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 */
export default function CreateAccountModal({ isOpen, onClose }) {
  const { createAccount, isLoading } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  /**
   * Handle input changes in the form
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validate form data before submission
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createAccount({
        username: formData.username,
        password: formData.password,
      });

      // Close modal and reset form on success
      setFormData({ username: "", password: "", confirmPassword: "" });
      setErrors({});
      onClose();
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes("Username already exists")) {
        setErrors({ username: "Username already exists" });
      } else {
        setErrors({ general: "Failed to create account. Please try again." });
      }
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setFormData({ username: "", password: "", confirmPassword: "" });
    setErrors({});
    onClose();
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Account</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-account-form">
          {errors.general && <div className="error-message general-error">{errors.general}</div>}

          <div className="form-group">
            <label htmlFor="create-username">Username:</label>
            <input
              type="text"
              id="create-username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              autoComplete="username"
              disabled={isLoading}
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="create-password">Password:</label>
            <input
              type="password"
              id="create-password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleClose} className="cancel-button" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
