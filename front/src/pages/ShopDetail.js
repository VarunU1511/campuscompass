import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ReviewSection from "../components/ReviewSection";

const ShopDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/listings/shops/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch listing details");
        }
        const data = await response.json();
        if (data.success) {
          setListing(data.listing);
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
  };

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

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found</div>;

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
              <ContactTitle>Shop Address</ContactTitle>
              <ContactInfo>
                <InfoItem>
                  <Label>Location:</Label>
                  <Value>{listing?.location || "Not available"}</Value>
                </InfoItem>
              </ContactInfo>
              <WhatsAppButton onClick={handleWhatsAppClick}>
                <WhatsAppIcon>💬</WhatsAppIcon>
                Chat with Owner
              </WhatsAppButton>
            </ContactSection>
          </DialogBody>
        </DialogContent>
      </DialogOverlay>
    );
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <ImageSection>
          <MainImage>
            <img
              src={getImageUrl(listing?.images?.[currentImageIndex])}
              alt={listing?.title || "Shop image"}
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
          <ShopType>{listing.shopType}</ShopType>

          <Section>
            <SectionTitle>Opening Hours</SectionTitle>
            <Description>{listing.openingHours}</Description>
          </Section>

          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{listing.description}</Description>
          </Section>

          <ContactButton onClick={() => setShowContactDialog(true)}>
            Contact Shop Owner
          </ContactButton>

          {showContactDialog && (
            <ContactDialog onClose={() => setShowContactDialog(false)} />
          )}

          <ReviewSection listingId={listing._id} ownerId={listing.owner._id} />
        </DetailsSection>
      </ContentWrapper>
    </PageContainer>
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

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;

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
  width: 80px;
  height: 80px;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  font-family: "Open Sans", sans-serif;
`;

const ShopType = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: #4b49ac;
  text-transform: capitalize;
  font-family: "Montserrat", sans-serif;
`;

const Section = styled.div`
  margin-top: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-family: "Montserrat", sans-serif;
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
  background: #4b49ac;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
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
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const DialogTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

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
  margin-bottom: 1rem;
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  color: #666;
`;

const Value = styled.span`
  color: #333;
`;

const WhatsAppButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #25d366;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #128c7e;
  }
`;

const WhatsAppIcon = styled.span`
  font-size: 1.2rem;
`;

export default ShopDetail;
