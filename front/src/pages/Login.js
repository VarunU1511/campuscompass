import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Login = ({ userType }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login({
        ...formData,
        userType: userType // Pass the userType from props
      });
      
      if (result.success) {
        // Redirect based on user type
        navigate(userType === 'owner' ? '/owner-dashboard' : '/student-dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <PageContainer>
      <FormCard>
        <SectionTitle>Welcome back</SectionTitle>
        <Subtitle>
          Don't have an account? <Link to="/register">Sign up for free</Link>
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </LoginButton>
        </Form>
      </FormCard>
    </PageContainer>
  );
};

// Styled Components (updated for new UI)
const PageContainer = styled.div`
  display: flex;
  border-radius: 40px 40px 40px 40px;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    rgba(244, 244, 250, 0.97) 0%,
    rgba(225, 225, 253, 0.71) 100%
  );
`;

const FormCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  padding-bottom: 1.2rem;
  color: #333;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: #4b49ac;
    border-radius: 10px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-family: "Open Sans", sans-serif;
  line-height: 1.6;

  a {
    color: #4B49AC;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 1rem 1.2rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: "Open Sans", sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4B49AC;
    box-shadow: 0 0 0 2px rgba(75, 73, 172, 0.1);
  }
`;

const LoginButton = styled.button`
  padding: 1rem 1.8rem;
  background: #4B49AC;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transition: width 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    background: #3f3e8f;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(75, 73, 172, 0.3);
    &::before {
      width: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #9e9dc6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 10px;
  font-family: "Open Sans", sans-serif;
  font-size: 0.95rem;
`;

export default Login;