import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <Nav>
      <NavBrand to="/admin/dashboard">Admin Dashboard</NavBrand>
      <NavLinks>
        <NavLink to="/admin/dashboard">Overview</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/listings">Listings</NavLink>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  background: #2d2c54;
  padding: 1.2rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 40px 40px 40px 40px;
  top: 0;
  z-index: 100;
  font-family: "Montserrat", sans-serif;
`;

const NavBrand = styled(Link)`
  color: white;
  font-size: 1.8rem;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: white;
    transition: width 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);

    &:after {
      width: 100%;
    }
  }
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;

  &:hover {
    background: white;
    color: #2d2c54;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default AdminNavbar;
