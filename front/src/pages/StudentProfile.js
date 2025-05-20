import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const StudentProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    contactNumber: user?.phone || "",
    age: user?.age || "",
    studentId: user?.studentId || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle profile update logic
  };

  return (
    <ProfileContainer>
      <LogoContainer>
        <Logo>
          <svg
            width="36"
            height="36"
            viewBox="0 0 32 32"
            aria-hidden="true"
            style={{ marginRight: 8, verticalAlign: "middle" }}
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="#f5f5fa"
              stroke="#4b49ac"
              strokeWidth="2"
            />
            <polygon points="16,7 21,25 16,21 11,25" fill="#4b49ac" />
            <circle
              cx="16"
              cy="16"
              r="2.2"
              fill="#fff"
              stroke="#4b49ac"
              strokeWidth="1.2"
            />
          </svg>
          Campus Compass
        </Logo>
      </LogoContainer>

      <Header>
        <Title>My Profile</Title>
        <Subtitle>Manage your personal information</Subtitle>
      </Header>

      <FormCard>
        <FormSection>
          <FormGroup>
            <Label>Full Name</Label>
            <InputGroup>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Email Address</Label>
            <InputGroup>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Contact Number</Label>
            <InputGroup>
              <Input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Age</Label>
            <InputGroup>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Student ID</Label>
            <InputGroup>
              <Input
                type="text"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <SaveButton onClick={handleSubmit}>Save Changes</SaveButton>
        </FormSection>
      </FormCard>
    </ProfileContainer>
  );
};

// Styled components (updated for new UI)
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3.5rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(244, 244, 250, 0.97) 0%,
    rgba(225, 225, 253, 0.71) 100%
  );
  border-radius: 40px;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-bottom: 1.2rem;

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
  color: #666;
  font-size: 1.1rem;
  font-family: "Open Sans", sans-serif;
  margin-bottom: 0;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #4b49ac;
  font-family: "Montserrat", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-family: "Open Sans", sans-serif;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: "Open Sans", sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4b49ac;
    box-shadow: 0 0 0 2px rgba(75, 73, 172, 0.1);
  }
`;

const EditIcon = styled.span`
  position: absolute;
  right: 1rem;
  color: #666;
  cursor: pointer;
  font-size: 1.1rem;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 1rem 1.8rem;
  background: #4b49ac;
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
`;

// Remove or use these styled components
// const ProfileImageSection = styled.div`...`;
// const ProfileImage = styled.img`...`;
// const UploadButton = styled.button`...`;
export default StudentProfile;
