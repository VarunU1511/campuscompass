import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const AccountType = ({ isLogin = false }) => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <FormCard>
        <SectionTitle>
          {isLogin ? "Login to Your Account" : "Create Your Account"}
        </SectionTitle>
        <SectionSubtitle>
          Choose your account type to {isLogin ? "login" : "get started"}
        </SectionSubtitle>

        <CardsContainer>
          <AccountCard>
            <IconContainer>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#4b49ac">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
              </svg>
            </IconContainer>
            <CardTitle>
              {isLogin ? "Login as Student" : "Sign up as Student"}
            </CardTitle>
            <CardDescription>Find amenities near your campus</CardDescription>
            <ContinueButton
              onClick={() =>
                navigate(isLogin ? "/login/student" : "/register/student")
              }
            >
              Continue as Student
            </ContinueButton>
          </AccountCard>

          <AccountCard>
            <IconContainer>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#4b49ac">
                <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
              </svg>
            </IconContainer>
            <CardTitle>
              {isLogin ? "Login as Owner" : "Sign up as Owner"}
            </CardTitle>
            <CardDescription>
              List your property or business for students
            </CardDescription>
            <ContinueButton
              onClick={() =>
                navigate(isLogin ? "/login/owner" : "/register/owner")
              }
            >
              Continue as Owner
            </ContinueButton>
          </AccountCard>
        </CardsContainer>
      </FormCard>
    </PageContainer>
  );
};

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
  max-width: 900px;
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

const SectionSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-family: "Open Sans", sans-serif;
  line-height: 1.6;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AccountCard = styled.div`
  padding: 2.8rem 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    background: linear-gradient(180deg, rgba(75, 73, 172, 0.1), transparent);
    transition: height 0.4s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: #4b49ac;

    &::before {
      height: 100%;
    }
  }
`;

const IconContainer = styled.div`
  width: 85px;
  height: 85px;
  background: #f0f0ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #4b49ac;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    border: 2px dashed rgba(75, 73, 172, 0.3);
    opacity: 0;
    transition: all 0.4s ease;
  }

  ${AccountCard}:hover & {
    background: #4b49ac;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 10px 25px rgba(75, 73, 172, 0.3);

    svg {
      fill: white;
    }

    &::after {
      opacity: 1;
      animation: spin 15s linear infinite;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CardTitle = styled.h2`
  margin: 0 0 1rem;
  font-weight: 600;
  color: #333;
  font-size: 1.3rem;
  position: relative;
  z-index: 1;
  font-family: "Montserrat", sans-serif;
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  font-family: "Open Sans", sans-serif;
  line-height: 1.5;
`;

const ContinueButton = styled.button`
  padding: 0.9rem 1.8rem;
  background: #4b49ac;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
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

export default AccountType;
