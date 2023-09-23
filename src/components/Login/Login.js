import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth, UserCredential } from "firebase/auth";
import bcrypt from "bcryptjs";

import InputControl from "../InputControl/InputControl";
import { auth } from "../../firebase";

import styles from "./Login.module.css";

function Login() {
  const navigation = useNavigate();
  const [formValues, setFormValues] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const checkUserExists = async (email) => {
    const authInstance = getAuth(auth);
    const userExists = await authInstance.fetchSignInMethodsForEmail(email);

    return userExists.length > 0;
  };

  const handleSubmit = async () => {
    if (!formValues.userEmail || !formValues.userPassword) {
      setErrorMessage("Fill all fields");
      return;
    }
    setErrorMessage("");

    if (!validateEmail(formValues.userEmail)) {
      setErrorMessage("Format of Email is not correct");
      return;
    }
    setErrorMessage("");

    setIsSubmitButtonDisabled(true);

    try {
      const hashedPassword = await bcrypt.hash(formValues.userPassword, 10);
      const email = formValues.userEmail;

      const isUserExists = await checkUserExists(email);

      if (!isUserExists) {
        setIsSubmitButtonDisabled(false);
        setErrorMessage("Email is not registered");
        return;
      }

      signInWithEmailAndPassword(auth, email, hashedPassword)
        .then(async (res) => {
          setIsSubmitButtonDisabled(false);
          navigation("/");
        })
        .catch((err) => {
          setIsSubmitButtonDisabled(false);
          setErrorMessage("Incorrect password");
        });
    } catch (err) {
      setIsSubmitButtonDisabled(false);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Login</h1>

        <InputControl
          label="Email"
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, userEmail: event.target.value }))
          }
          placeholder="Enter email address"
        />
        <InputControl
          label="Password"
          type="password"
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, userPassword: event.target.value }))
          }
          placeholder="Enter Password"
        />

        <div className={styles.footer}>
          <b className={styles.error}>{errorMessage}</b>
          <button disabled={isSubmitButtonDisabled} onClick={handleSubmit}>
            Login
          </button>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
