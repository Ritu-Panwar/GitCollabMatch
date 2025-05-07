import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { FaUserPlus, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false); // SIGNUP page shows first
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '', cpassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const togglePassword = () => setShowPassword(!showPassword);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5100/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });
      const json = await res.json();
      setLoading(false);
      if (json.success) {
        localStorage.setItem('token', json.authToken);
        localStorage.setItem('userId', json.user?._id);
        navigate('/');
      } else {
        setError('Invalid email or password.');
      }
    } catch {
      setLoading(false);
      setError('Login failed. Try again later.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;

    if (password !== cpassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5100/api/auth/createUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      setLoading(false);

      if (json.success) {
        localStorage.setItem('token', json.jwtToken);
        setIsLogin(true);
        setCredentials({ name: '', email: '', password: '', cpassword: '' });
      } else {
        setError('Signup failed. Invalid details.');
      }
    } catch {
      setLoading(false);
      setError('Signup failed. Try again later.');
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center">
      <Container style={{ maxWidth: '480px' }} data-aos="zoom-in">
        <Card className="shadow-lg border-0 rounded-4 p-4 auth-card">
          <div className="text-center">
            {isLogin ? (
              <FaSignInAlt size={37} className="text-primary" />
            ) : (
              <FaUserPlus size={37} className="text-success" />
            )}
            <h3 className="mt-3 fw-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
            <p className="text-muted">{isLogin ? 'Login to continue' : 'Join us and explore'}</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={isLogin ? handleLogin : handleSignup}>
            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={credentials.name}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                name="email"
                value={credentials.email}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  name="password"
                  value={credentials.password}
                  onChange={onChange}
                  required
                />
                <Button variant="outline-secondary" onClick={togglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            {!isLogin && (
              <Form.Group className="mb-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Re-enter password"
                  name="cpassword"
                  value={credentials.cpassword}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            )}

            <Button
              type="submit"
              className="w-100 rounded-pill mt-1 fw-semibold"
              variant={isLogin ? 'primary' : 'success'}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Processing...
                </>
              ) : isLogin ? (
                'Login'
              ) : (
                'Sign Up'
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>{isLogin ? "Don't have an account?" : 'Already have an account?'}</p>
            <Button
              variant="outline-dark"
              className="rounded-pill"
              size="sm"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setCredentials({ name: '', email: '', password: '', cpassword: '' });
              }}
            >
              {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AuthPage;
