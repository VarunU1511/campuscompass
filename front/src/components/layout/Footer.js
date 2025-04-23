import styled from "styled-components";
import { Link } from "react-router-dom";

const FooterWrapper = styled.footer`
  background-color: #2d2c54;
  color: white;
  padding: 3rem 0 2rem;
  margin-top: auto;
  border-radius: 40px 40px 40px 40px;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(75, 73, 172, 0.1);
    z-index: 0;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  position: relative;
  z-index: 1;
`;

const FooterSection = styled.div`
  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    font-weight: 600;
    font-family: "Montserrat", sans-serif;
    position: relative;
    padding-bottom: 0.8rem;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: #4b49ac;
      border-radius: 10px;
    }
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.8rem;
    font-family: "Open Sans", sans-serif;
  }

  p {
    line-height: 1.6;
    font-family: "Open Sans", sans-serif;
  }

  a {
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;

    &:hover {
      color: #a5a4e0;
      transform: translateX(5px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-family: "Open Sans", sans-serif;
  position: relative;
  z-index: 1;
`;

const DeveloperLink = styled(Link)`
  color: rgba(255, 255, 255, 0.05);
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: inline-block;
  font-family: "Open Sans", sans-serif;

  &:hover {
    color: white;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <h3>Campus Compass</h3>
          <p>
            Finding your perfect student accommodation made easy. Explore
            options for PGs, hotels, and local services near your campus.
          </p>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/accommodations">Accommodations</Link>
            </li>
            <li>
              <Link to="/restaurants">Hotels & Messes</Link>
            </li>
            <li>
              <Link to="/shops">Shops</Link>
            </li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Contact Us</h3>
          <ul>
            <li>Email: support@campuscompass.com</li>
            <li>Phone: +91 123-456-7890</li>
            <li>Address: 123 College Street, City</li>
          </ul>
        </FooterSection>
      </FooterContent>

      <Copyright>
        <p>
          &copy; {new Date().getFullYear()} Campus Compass. All rights reserved.
        </p>
        <DeveloperLink to="/admin/login">Developer</DeveloperLink>
      </Copyright>
    </FooterWrapper>
  );
};

export default Footer;
