import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user?.userType === "owner" || user?.role === "owner") {
      navigate("/owner-dashboard");
    } else if (user?.userType === "student" || user?.role === "student") {
      navigate("/student-dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Update the return statement to use AuthLink for login and register
  return (
    <Nav>
      <NavBrand to="/">
        <CompassLogo
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="14" fill="#f5f5fa" stroke="#4b49ac" strokeWidth="2"/>
          <polygon points="16,7 21,25 16,21 11,25" fill="#4b49ac"/>
          <circle cx="16" cy="16" r="2.2" fill="#fff" stroke="#4b49ac" strokeWidth="1.2"/>
        </CompassLogo>
        Campus Compass
      </NavBrand>

      <NavLinks>
        <NavLink to="/accommodations">Accommodations</NavLink>
        <NavLink to="/restaurants">Hotels & Messes</NavLink>
        <NavLink to="/shops">Shops</NavLink>

        {!user ? (
          <>
            <AuthLink to="/login">Login</AuthLink>
            <AuthLink to="/register" primary>
              Register
            </AuthLink>
          </>
        ) : (
          <>
            {user.role === "admin" && <NavLink to="/profile">Profile</NavLink>}

            {/* Show Dashboard and Logout for owner (not admin) */}
            {(user.userType === "owner" || user.role === "owner") && user.role !== "admin" && (
              <>
                <NavButton type="button" onClick={handleDashboardClick}>
                  Dashboard
                </NavButton>
                <LogoutButton type="button" onClick={handleLogout}>
                  Logout
                </LogoutButton>
              </>
            )}

            {/* Show only Logout for student */}
            {(user.userType === "student" || user.role === "student") && user.role !== "admin" && (
              <LogoutButton type="button" onClick={handleLogout}>
                Logout
              </LogoutButton>
            )}
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  background: #fff;
  padding: 1.2rem 2.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 20px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  font-family: "Montserrat", sans-serif;
`;

const NavBrand = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #4b49ac;
  text-decoration: none;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CompassLogo = styled.svg`
  width: 2.2rem;
  height: 2.2rem;
  margin-right: 0.7rem;
  flex-shrink: 0;
  display: inline-block;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  position: relative;
  transition: all 0.3s ease;

  &:after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #4b49ac;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #4b49ac;

    &:after {
      width: 100%;
    }
  }
`;

const AuthLink = styled(Link)`
  color: ${(props) => (props.primary ? "white" : "#4b49ac")};
  background: ${(props) => (props.primary ? "#4b49ac" : "transparent")};
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: ${(props) =>
    props.primary ? "0.6rem 1.5rem" : "calc(0.6rem - 2px) calc(1.5rem - 2px)"};
  border-radius: 50px;
  border: ${(props) => (props.primary ? "none" : "2px solid #4b49ac")};
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(75, 73, 172, 0.2);
    background: ${(props) =>
      props.primary ? "#3f3e8f" : "rgba(75, 73, 172, 0.1)"};
  }
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.08);

  &:hover {
    background: #c82333;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(220, 53, 69, 0.18);
  }

  &:active {
    background: #a71d2a;
    transform: translateY(0);
  }
`;

const NavButton = styled.button`
  background: #4b49ac;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;

  &:hover {
    background: #3f3e8f;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(75, 73, 172, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default Navbar;
