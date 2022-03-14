import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { FormEventHandler, useState } from "react";
import { Button, Form, InputGroup, Modal, ModalBody } from "react-bootstrap";
import { getFirebaseAuthInstance } from "../db";

export const LoginModal = ({ onUserLogin, onSignupUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailChange = (email: string) => {
    setEmail(email);
  };

  const onPasswordChange = (pwd: string) => {
    setPassword(pwd);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);

    if (email && password) {
      console.log(email, password);
      signInWithEmailAndPassword(getFirebaseAuthInstance(), email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          onUserLogin(user);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/user-not-found") {
            createUserWithEmailAndPassword(
              getFirebaseAuthInstance(),
              email,
              password
            )
              .then((userCredential) => {
                const user = userCredential.user;
                onSignupUser(user);
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
              });
          }
        });
    }
  };

  return (
    <Modal show={true} dialogClassName="w-50" centered>
      <Modal.Header>Login</Modal.Header>
      <ModalBody className="px-5">
        <Form
          className="d-flex flex-column justify-content-center "
          onSubmit={onSubmit}
        >
          <Form.Group className="">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              onChange={(e) => onEmailChange(e.currentTarget.value)}
            />
          </Form.Group>
          <Form.Group className="mt-5">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              onChange={(e) => onPasswordChange(e.currentTarget.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-center w-100 mt-5">
            <Button
              className="d-flex justify-content-center w-25"
              variant="primary"
              type="submit"
            >
              Login
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};
