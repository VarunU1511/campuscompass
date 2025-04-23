import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Register = ({ userType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all required fields
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('All fields are required');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone number (basic validation)
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      const response = await authService.register(formData, userType);
      
      // Check if we have both success and token in the response
      if (response && response.success && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', userType);
        
        // Navigate based on userType
        if (userType === 'student') {
          navigate('/student-dashboard');
        } else if (userType === 'owner') {
          navigate('/owner-dashboard');
        }
      } else {
        setError('Registration failed: Invalid server response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Display the specific error message from the server if available
      setError(
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      );
    }
  };

  return (
    <PageContainer>
      <FormCard>
        <SectionTitle>Create Account</SectionTitle>
        <Subtitle>Please fill in your details</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </FormGroup>

          <RegisterButton type="submit">Create Account</RegisterButton>
        </Form>

        <LoginLink>
          Already have an account? <Link to="/login">Log in</Link>
        </LoginLink>
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
  max-width: 600px;
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

const RegisterButton = styled.button`
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

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
  font-family: "Open Sans", sans-serif;

  a {
    color: #4B49AC;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
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

export default Register;
