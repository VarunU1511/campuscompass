import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
// Remove the unused 'CategoryIcon' import
// import CategoryIcon from '../components/CategoryIcon';
import { useAuth } from "../context/AuthContext";
import AdminNavbar from "../components/navigation/AdminNavbar";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.section`
  height: 650px;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.65)),
    url("/images/home.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 4rem;
  border-radius: 40px 40px 40px 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(75, 73, 172, 0.25) 0%,
      transparent 70%
    );
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  animation: fadeIn 1s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h1 {
    font-size: 3.8rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    color: white;
    font-family: "Montserrat", sans-serif;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 1.4rem;
    margin-bottom: 2.5rem;
    line-height: 1.6;
    opacity: 0.95;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    font-family: "Open Sans", sans-serif;
    font-weight: 300;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  position: relative;
  animation: slideUp 0.8s ease-out 0.3s both;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 50px;
  overflow: hidden;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1.4rem 2.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px #4b49ac;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;
  bottom: 6px;
  padding: 0 2.2rem;
  background: #4b49ac;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #3f3e8f;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(75, 73, 172, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(75, 73, 172, 0.4);
  }
`;

const SectionTitle = styled.h2`
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
  margin-bottom: 3.5rem;
  font-size: 1.1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-family: "Open Sans", sans-serif;
  line-height: 1.6;
`;

const CategorySection = styled.section`
  margin: 6rem 0;
  padding: 2rem 0;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCard = styled.div`
  background: white;
  padding: 2.8rem 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  cursor: pointer;
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

  h3 {
    margin: 1.5rem 0 0.8rem;
    font-weight: 600;
    color: #333;
    font-size: 1.3rem;
    position: relative;
    z-index: 1;
    font-family: "Montserrat", sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  p {
    color: #666;
    font-size: 0.95rem;
    position: relative;
    z-index: 1;
    font-family: "Open Sans", sans-serif;
    line-height: 1.5;
  }
`;

const IconWrapper = styled.div`
  width: 85px;
  height: 85px;
  background: #f0f0ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: #4b49ac;
  font-size: 2rem;
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

  ${CategoryCard}:hover & {
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

const FeaturedSection = styled.section`
  margin: 6rem 0;
  padding: 5rem 0;
  background: linear-gradient(135deg, #f9f9ff 0%, #f0f0ff 100%);
  border-radius: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(75, 73, 172, 0.1);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(75, 73, 172, 0.05);
  }
`;

const ListingGrid = styled.div`
  display: grid;
  margin: 1rem;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const ListingImage = styled.div`
  width: 100%;
  height: 240px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  ${ListingCard}:hover & {
    img {
      transform: scale(1.1);
    }

    &::after {
      opacity: 1;
    }
  }
`;

const ListingContent = styled.div`
  padding: 2rem;
`;

const ListingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    margin: 0;
    font-family: "Montserrat", sans-serif;
  }
`;

const ListingLocation = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
  font-family: "Open Sans", sans-serif;

  svg {
    margin-right: 8px;
    color: #4b49ac;
  }
`;

const ListingDescription = styled.p`
  color: #666;
  margin-bottom: 1.8rem;
  font-size: 0.95rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: "Open Sans", sans-serif;
`;

const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  color: #28a745;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  background: rgba(40, 167, 69, 0.1);
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.95rem;

  svg {
    margin-right: 5px;
  }
`;

const ViewDetailsButton = styled(Link)`
  background-color: #4b49ac;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  margin-top: 1rem;

  &:hover {
    background-color: #3f3e8f;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(75, 73, 172, 0.18);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatsSection = styled.section`
  margin: 5rem 0;
  padding: 3rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border-color: #4b49ac;
  }

  h3 {
    font-size: 2.3rem;
    color: #4b49ac;
    margin-bottom: 0.5rem;
    font-weight: 700;
    font-family: "Montserrat", sans-serif;
  }

  p {
    color: #666;
    font-size: 1rem;
    font-family: "Open Sans", sans-serif;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/listings/restaurants"
        );
        if (response.data.success) {
          // Get first 3 restaurants
          setFeaturedRestaurants(response.data.listings.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching featured restaurants:", error);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Clean up the path
    const cleanPath = imagePath
      .split("\\")
      .pop() // Remove Windows-style path
      .split("/")
      .pop(); // Get just the filename

    // Ensure we're using the correct path format
    return `${process.env.REACT_APP_API_URL}/uploads/listings/${cleanPath}`;
  };

  return (
    <>
      {user?.role === "admin" && <AdminNavbar />}
      <HeroSection>
        <HeroContent>
          <h1>Find Your Perfect College Space</h1>
          <p>
            Student accommodations, dining options, and local services tailored
            for you
          </p>
          <SearchContainer>
            <SearchForm onSubmit={handleSearch}>
              <SearchInput
                placeholder="Search for listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit">Search</SearchButton>
            </SearchForm>
          </SearchContainer>
        </HeroContent>
      </HeroSection>

      <Container>
        <StatsSection>
          <StatsGrid>
            <StatCard>
              <h3>500+</h3>
              <p>Accommodations</p>
            </StatCard>
            <StatCard>
              <h3>200+</h3>
              <p>Restaurants</p>
            </StatCard>
            <StatCard>
              <h3>300+</h3>
              <p>Shops</p>
            </StatCard>
            <StatCard>
              <h3>5000+</h3>
              <p>Happy Students</p>
            </StatCard>
          </StatsGrid>
        </StatsSection>

        <CategorySection>
          <SectionTitle>Popular Categories</SectionTitle>
          <SectionSubtitle>
            Explore services around your campus tailored to enhance your college
            experience
          </SectionSubtitle>
          <CategoryGrid>
            <CategoryCard onClick={() => navigate("/accommodations")}>
              <IconWrapper>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#4b49ac">
                  <path d="M12 3L4 9v12h16V9l-8-6zm-2 15H8v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4z" />
                </svg>
              </IconWrapper>
              <h3>Accommodations</h3>
              <p>Find the perfect place to stay near your campus</p>
            </CategoryCard>
            <CategoryCard onClick={() => navigate("/restaurants")}>
              <IconWrapper>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#4b49ac">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                </svg>
              </IconWrapper>
              <h3>Hotels & Messes</h3>
              <p>Discover delicious dining options for every taste</p>
            </CategoryCard>
            <CategoryCard onClick={() => navigate("/shops")}>
              <IconWrapper>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#4b49ac">
                  <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
                </svg>
              </IconWrapper>
              <h3>Shops</h3>
              <p>Explore local stores for all your daily needs</p>
            </CategoryCard>
          </CategoryGrid>
        </CategorySection>

        <FeaturedSection>
          <SectionTitle>Featured Listings</SectionTitle>
          <SectionSubtitle>
            Discover top-rated places near your campus recommended by fellow
            students
          </SectionSubtitle>
          <ListingGrid>
            {featuredRestaurants.map((restaurant) => (
              <ListingCard key={restaurant._id}>
                <ListingImage>
                  <img
                    src={getImageUrl(restaurant.images?.[0])}
                    alt={restaurant.title}
                    crossOrigin="anonymous"
                  />
                </ListingImage>
                <ListingContent>
                  <ListingHeader>
                    <h3>{restaurant.title}</h3>
                    <Rating>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      {restaurant.rating || "4.5"}
                    </Rating>
                  </ListingHeader>
                  <ListingLocation>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {restaurant.location}
                  </ListingLocation>
                  <ListingDescription>
                    {restaurant.description ||
                      "A wonderful restaurant with delicious food and great ambiance. Perfect for students looking for quality dining options near campus."}
                  </ListingDescription>
                  <ViewDetailsButton to={`/restaurants/${restaurant._id}`}>
                    View Details
                  </ViewDetailsButton>
                </ListingContent>
              </ListingCard>
            ))}
          </ListingGrid>
        </FeaturedSection>
      </Container>
    </>
  );
};

export default Home;
