import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ReviewSection from "../components/ReviewSection";
import ErrorBoundary from "../components/ErrorBoundary";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        console.log("Fetching listing details for ID:", id);
        // Validate ID format
        if (!id || id.length !== 24) {
          throw new Error("Invalid listing ID format");
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/listings/restaurants/${id}`
        );

        const data = await response.json();
        console.log("Received listing data:", data);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch listing details: ${
              data.message || response.statusText
            }`
          );
        }

        if (data.success) {
          setListing(data.listing);
        } else {
          throw new Error(data.message || "Failed to fetch listing");
        }
      } catch (error) {
        console.error("Full error object:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found</div>;

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

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const ContactDialog = ({ onClose }) => {
    const handleWhatsAppClick = () => {
      const phoneNumber = listing?.owner?.phone || "7385618460";
      const message = encodeURIComponent(
        "Hi, I'm interested in your listing on Campus Compass. Could you please share more details?"
      );
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    };

    return (
      <DialogOverlay onClick={onClose}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </DialogHeader>

          <DialogBody>
            <ContactSection>
              <ContactTitle>Owner Information</ContactTitle>
              <ContactInfo>
                <InfoItem>
                  <Label>Name:</Label>
                  <Value>{listing?.owner?.name || "Not available"}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Email:</Label>
                  <Value>{listing?.owner?.email || "Not available"}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Phone:</Label>
                  <Value>{listing?.owner?.phone || "7385618460"}</Value>
                </InfoItem>
              </ContactInfo>
            </ContactSection>
            <WhatsAppButton onClick={handleWhatsAppClick}>
              <WhatsAppIcon>💬</WhatsAppIcon>
              Chat with Owner
            </WhatsAppButton>
          </DialogBody>
        </DialogContent>
      </DialogOverlay>
    );
  };

  return (
    <ErrorBoundary>
      <PageContainer>
        <ImageSection>
          <MainImage>
            {imageLoading && <LoadingSpinner>Loading...</LoadingSpinner>}
            <img
              src={getImageUrl(listing?.images?.[currentImageIndex])}
              alt={listing?.title || "Restaurant image"}
              onLoad={handleImageLoad}
              onError={(e) => {
                console.error("Image failed to load:", e.target.src);
                setImageLoading(false);
              }}
              style={{ display: imageLoading ? "none" : "block" }}
              crossOrigin="anonymous"
            />
          </MainImage>
          <ThumbnailContainer>
            {listing?.images?.map((image, index) => (
              <Thumbnail
                key={index}
                onClick={() => handleImageChange(index)}
                active={currentImageIndex === index}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${listing.title} - Thumbnail ${index + 1}`}
                  onError={(e) => {
                    console.error("Thumbnail failed to load:", e.target.src);
                  }}
                  crossOrigin="anonymous"
                />
              </Thumbnail>
            ))}
          </ThumbnailContainer>
        </ImageSection>

        <DetailsSection>
          <Title>{listing.title}</Title>
          <Location>📍 {listing.location}</Location>
          <Cuisine>{listing.cuisineType.join(", ")}</Cuisine>
          <Price>₹{listing.price} /month</Price>
          <Description>{listing.description}</Description>
          <ContactButton onClick={() => setShowContactDialog(true)}>
            Contact Owner
          </ContactButton>
          {showContactDialog && (
            <ContactDialog onClose={() => setShowContactDialog(false)} />
          )}
        </DetailsSection>
        {/* Place ReviewSection directly, do not wrap in extra card */}
        <ReviewSection listingId={listing._id} ownerId={listing.owner?._id} />
      </PageContainer>
    </ErrorBoundary>
  );
};

// Styled Components (matching PGDetails.js styling)
const PageContainer = styled.div`
  padding: 2.5rem 1.5rem 3.5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(
    135deg,
    rgba(244, 244, 250, 0.97) 0%,
    rgba(225, 225, 253, 0.71) 100%
  );
  border-radius: 40px;
`;

const ImageSection = styled.div`
  margin-bottom: 2rem;
`;

const MainImage = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 1rem;
  border-radius: 20px;
  overflow: hidden;
  background-color: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const Thumbnail = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${(props) => (props.active ? "#4B49AC" : "transparent")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DetailsSection = styled.div`
  margin-bottom: 2rem;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #333;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Location = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
  font-family: "Open Sans", sans-serif;
`;

const Cuisine = styled.span`
  font-size: 1.1rem;
  color: #666;
  margin-right: 1rem;
  font-family: "Open Sans", sans-serif;
`;

const Price = styled.span`
  font-size: 1.1rem;
  color: #4b49ac;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
  font-family: "Open Sans", sans-serif;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ContactButton = styled.button`
  background-color: #4b49ac;
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  margin-top: 1rem;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;

  &:hover {
    background: #3f3e8f;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(75, 73, 172, 0.18);
  }
`;

// Dialog styled components
const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
`;

const DialogTitle = styled.h2`
  margin: 0;
  color: #333;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }
`;

const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  color: #4b49ac;
  margin-bottom: 1rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: #f9f9ff;
  padding: 1.2rem;
  border-radius: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const Label = styled.span`
  font-weight: 500;
  color: #666;
  min-width: 80px;
  font-family: "Open Sans", sans-serif;
`;

const Value = styled.span`
  color: #333;
  font-family: "Open Sans", sans-serif;
`;

const WhatsAppButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: #25d366;
  color: white;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 0.5rem;

  &:hover {
    background: #128c7e;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(18, 140, 126, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const WhatsAppIcon = styled.span`
  font-size: 1.2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
  color: #666;
`;

const RestaurantDetailPage = () => (
  <ErrorBoundary>
    <RestaurantDetail />
  </ErrorBoundary>
);

export default RestaurantDetailPage;
