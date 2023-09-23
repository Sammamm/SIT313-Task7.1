import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import bcrypt from "bcryptjs";

import InputControl from "../InputControl/InputControl";
import { auth } from "../../firebase";

import styles from "./Signup.module.css";

function Signup() {
  const navigation = useNavigate();
  const [formValues, setFormValues] = useState({
    fullName: "",
    userEmail: "",
    userPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async () => {
    if (!formValues.fullName || !formValues.userEmail || !formValues.userPassword) {
      setErrorMessage("All fields are not filled");
      return;
    } else if (!validateEmail(formValues.userEmail)) {
      setErrorMessage("Incorrect Email");
      return;
    }
    setErrorMessage("");

    setIsSubmitButtonDisabled(true);

    try {
      const hashedPassword = await bcrypt.hash(formValues.userPassword, 10);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.userEmail,
        hashedPassword
      );

      const user = userCredential.user;
      await updateProfile(user, {
        displayName: formValues.fullName,
      });
      navigation("/");
    } catch (err) {
      setIsSubmitButtonDisabled(false);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Signup</h1>

        <InputControl
          label="Name"
          placeholder="Enter your name"
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, fullName: event.target.value }))
          }
        />
        <InputControl
          label="Email"
          placeholder="Enter email address"
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, userEmail: event.target.value }))
          }
        />
        <InputControl
          label="Password"
          type="password"
          placeholder="Enter password"
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, userPassword: event.target.value }))
          }
        />

        <div className={styles.footer}>
          <b className={styles.error}>{errorMessage}</b>
          <button onClick={handleSubmit} disabled={isSubmitButtonDisabled}>
            Signup
          </button>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
