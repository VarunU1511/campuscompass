import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const Accommodations = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;  // Add mounted flag

    const fetchAllListings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_URL}/api/listings/accommodations`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        
        if (mounted && data.success) {  // Check if component is still mounted
          setListings(data.listings || []);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAllListings();
    return () => { mounted = false; };  // Cleanup
  }, []);

  const getImageUrl = (listing) => {
    if (!listing.images || listing.images.length === 0) {
      return null;
    }
    
    const imagePath = listing.images[0];
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Clean up the path
    const cleanPath = imagePath
      .split('\\').pop() // Remove Windows-style path
      .split('/').pop(); // Get just the filename
    
    return `${config.API_URL}/uploads/listings/${cleanPath}`;
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading accommodations...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <SectionTitle>Student Accommodations</SectionTitle>
        <SectionSubtitle>Find comfortable PG accommodations near your campus</SectionSubtitle>
      </Header>

      {/* Existing listings grid */}
      {listings.length === 0 ? (
        <NoListings>No accommodations available at the moment.</NoListings>
      ) : (
        <ListingsGrid>
          {listings.map((listing) => (
            <ListingCard key={listing._id}>
              <ListingImageWrapper>
                <ListingImage 
                  src={getImageUrl(listing)}
                  alt={listing.title}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                  }}
                  crossOrigin="anonymous"
                />
              </ListingImageWrapper>
              <ListingContent>
                <ListingHeader>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <PriceTag>₹{listing.price} <span>/month</span></PriceTag>
                </ListingHeader>
                <ListingLocation>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B49AC" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {listing.location}
                </ListingLocation>
                <ListingDetails>
                  <Detail>Room Type: {listing.roomType}</Detail>
                  <Detail>Available Rooms: {listing.availableRooms}</Detail>
                </ListingDetails>
                
                <ViewDetailsButton onClick={() => navigate(`/pg/${listing._id}`)}>
                  View Details
                </ViewDetailsButton>
              </ListingContent>
            </ListingCard>
          ))}
        </ListingsGrid>
      )}
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  text-align: center;
  margin: 3rem 0 4rem;
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
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-family: "Open Sans", sans-serif;
  line-height: 1.6;
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: #4b49ac;
  }
`;

const ListingImageWrapper = styled.div`
  width: 100%;
  height: 220px;
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

  ${ListingCard}:hover &::after {
    opacity: 1;
  }
`;

const ListingImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;

  ${ListingCard}:hover & {
    transform: scale(1.1);
  }
`;

const ListingContent = styled.div`
  padding: 1.8rem;
`;

const ListingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ListingTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  font-family: "Montserrat", sans-serif;
`;

const PriceTag = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: #4B49AC;
  margin: 0;
  font-family: "Montserrat", sans-serif;

  span {
    font-size: 0.9rem;
    color: #666;
    font-weight: normal;
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
  }
`;

const ListingDetails = styled.div`
  margin-bottom: 1.5rem;
  font-family: "Open Sans", sans-serif;
`;

const Detail = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const ViewDetailsButton = styled.button`
  width: 100%;
  padding: 0.9rem 1.8rem;
  background: #4B49AC;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #666;
  font-family: "Montserrat", sans-serif;
`;

const NoListings = styled.div`
  text-align: center;
  padding: 5rem 0;
  color: #666;
  font-size: 1.2rem;
  font-family: "Open Sans", sans-serif;
`;

export default Accommodations;