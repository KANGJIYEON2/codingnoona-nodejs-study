import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { userActions } from "../action/userAction";
import "../style/register.style.css";
import * as types from "../constants/user.constants";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const [localError, setLocalError] = useState(null);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch({ type: types.REGISTER_USER_FAIL, payload: null }); // 컴포넌트 마운트 시 에러 초기화
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => {
        dispatch({ type: types.REGISTER_USER_FAIL, payload: null });
        setLocalError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;
    if (password !== confirmPassword) {
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      return;
    }

    if (!policy) {
      setPolicyError(true);
      return;
    }
    setPasswordError("");
    setPolicyError(false);
    setLocalError(null);
    dispatch(userActions.registerUser({ name, email, password }, navigate));
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { id, value, checked } = event.target;
    if (id === "policy") {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
    if (localError) {
      setLocalError(null);
      dispatch({ type: types.REGISTER_USER_FAIL, payload: null });
    }
  };

  return (
    <Container className="register-area">
      {localError && (
        <div>
          <Alert variant="danger" className="error-message">
            {localError}
          </Alert>
        </div>
      )}
      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
            value={formData.email}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={handleChange}
            required
            value={formData.name}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            required
            value={formData.password}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            isInvalid={!!passwordError}
            value={formData.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy}
          />
        </Form.Group>
        <Button variant="danger" type="submit">
          회원가입
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
