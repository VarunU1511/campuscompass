import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../hooks/useReviews";

const ReviewSection = ({ listingId }) => {
  const { user } = useAuth();
  const {
    reviews,
    loading,
    error: reviewsError,
    addReview,
  } = useReviews(listingId);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    images: [],
  });

  const validateReview = () => {
    if (!user) {
      return "Please login to submit a review";
    }

    if (user.userType !== "student") {
      return "Only students can submit reviews";
    }

    if (!newReview.comment.trim()) {
      return "Please enter a review comment";
    }

    if (newReview.comment.trim().length < 10) {
      return "Review comment must be at least 10 characters long";
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      return "Rating must be between 1 and 5";
    }

    return null;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (files.length > 5) {
      alert("You can only upload up to 5 images");
      e.target.value = "";
      return;
    }

    // Validate file size and type
    const invalidFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      const isValidSize = file.size <= maxSize;
      return !isValidType || !isValidSize;
    });

    if (invalidFiles.length > 0) {
      alert(
        "Some files were rejected. Please ensure all files are images (JPG/PNG) and under 5MB"
      );
      e.target.value = "";
      return;
    }

    setNewReview((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateReview();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();
      formData.append("listingId", listingId);
      formData.append("listing", listingId);
      formData.append("rating", newReview.rating.toString());
      formData.append("comment", newReview.comment.trim());
      formData.append("userId", user._id);

      console.log("Review Data being sent:", {
        listingId,
        listing: listingId,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        userId: user._id,
        imagesCount: newReview.images?.length || 0,
      });

      if (newReview.images && newReview.images.length > 0) {
        newReview.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await addReview(formData);

      if (!response.success) {
        throw new Error(response.message || "Failed to add review");
      }

      setNewReview({
        rating: 5,
        comment: "",
        images: [],
      });

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      setSubmitError(
        err.message || "Error submitting review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner>Loading reviews...</LoadingSpinner>;
  if (reviewsError) return <ErrorMessage>{reviewsError}</ErrorMessage>;

  return (
    <ReviewContainer>
      <SectionTitle>Reviews</SectionTitle>
      {user && user.userType === "student" && (
        <StyledReviewForm onSubmit={handleSubmit}>
          <FormTitle>Write a Review</FormTitle>
          {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
          <FormGroup>
            <StyledLabel>Rating:</StyledLabel>
            <StyledSelect
              value={newReview.rating}
              onChange={(e) =>
                setNewReview((prev) => ({
                  ...prev,
                  rating: Number(e.target.value),
                }))
              }
              disabled={submitting}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </option>
              ))}
            </StyledSelect>
          </FormGroup>
          <FormGroup>
            <StyledLabel>Comment:</StyledLabel>
            <StyledTextarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              disabled={submitting}
              required
              minLength={10}
              placeholder="Write your review here (minimum 10 characters)"
            />
          </FormGroup>
          <FormGroup>
            <StyledLabel>Images (optional, max 5):</StyledLabel>
            <StyledFileInput
              type="file"
              onChange={handleImageChange}
              disabled={submitting}
              multiple
              accept="image/*"
            />
          </FormGroup>
          <StyledSubmitButton type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </StyledSubmitButton>
        </StyledReviewForm>
      )}

      <ReviewList>
        {reviews.length === 0 ? (
          <NoReviews>No reviews yet. Be the first to review!</NoReviews>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                <ReviewerName>{review.user.name}</ReviewerName>
                <Rating>{"⭐".repeat(review.rating)}</Rating>
              </ReviewHeader>
              <ReviewComment>{review.comment}</ReviewComment>
              {review.images?.length > 0 && (
                <ImageGrid>
                  {review.images.map((image, index) => (
                    <ReviewImage
                      key={index}
                      src={`http://localhost:5001${image}`}
                      alt="Review"
                    />
                  ))}
                </ImageGrid>
              )}
              {review.ownerFeedback && (
                <OwnerFeedback>
                  <OwnerFeedbackTitle>Owner's Response:</OwnerFeedbackTitle>
                  <OwnerFeedbackText>
                    {review.ownerFeedback.comment}
                  </OwnerFeedbackText>
                </OwnerFeedback>
              )}
            </ReviewCard>
          ))
        )}
      </ReviewList>
    </ReviewContainer>
  );
};

// --- Styled Components for new UI ---

const ReviewContainer = styled.section`
  margin: 3rem auto 0 auto;
  max-width: 800px;
  background: linear-gradient(
    135deg,
    rgba(244, 244, 250, 0.97) 0%,
    rgba(225, 225, 253, 0.71) 100%
  );
  border-radius: 40px;
  padding: 2.5rem 1.5rem 3.5rem 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
`;

const StyledReviewForm = styled.form`
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h3`
  font-size: 1.3rem;
  color: #4b49ac;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-family: "Open Sans", sans-serif;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  font-size: 1rem;
  font-family: "Open Sans", sans-serif;
  transition: all 0.2s ease;
  margin-top: 0.2rem;
  background: #f9f9fb;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  color: #333;
  
  &:focus {
    border-color: #4b49ac;
    outline: none;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(75, 73, 172, 0.08);
  }
`;

const StyledTextarea = styled.textarea`
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  font-size: 1rem;
  font-family: "Open Sans", sans-serif;
  background: #f9f9fb;
  color: #333;
  transition: all 0.2s ease;
  margin-top: 0.2rem;
  min-height: 120px;
  resize: vertical;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  &:focus {
    border-color: #4b49ac;
    outline: none;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(75, 73, 172, 0.08);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const StyledFileInput = styled.input`
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0.8rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  font-size: 1rem;
  font-family: "Open Sans", sans-serif;
  background: #f9f9fb;
  color: #333;
  margin-top: 0.2rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  &:focus {
    border-color: #4b49ac;
    outline: none;
    box-shadow: 0 0 0 2px rgba(75, 73, 172, 0.08);
  }

  &::file-selector-button {
    background: #4b49ac;
    color: white;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    margin-right: 1rem;
    cursor: pointer;
    transition: background 0.2s ease;
    font-family: "Montserrat", sans-serif;
  }

  &::file-selector-button:hover {
    background: #3f3e8f;
  }
`;

const StyledSubmitButton = styled.button`
  background: #4b49ac;
  color: white;
  padding: 1rem 1.8rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  font-family: "Montserrat", sans-serif;
  transition: all 0.3s ease;
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

  &:hover:not(:disabled) {
    background: #3f3e8f;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(75, 73, 172, 0.18);

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

const ReviewList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: #4b49ac;
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
`;

const Rating = styled.div`
  color: #ffc107;
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
  font-family: "Montserrat", sans-serif;
`;

const ReviewComment = styled.p`
  margin: 1rem 0;
  line-height: 1.5;
  color: #444;
  font-family: "Open Sans", sans-serif;
  font-size: 1.05rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ReviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-family: "Open Sans", sans-serif;
`;

const OwnerFeedback = styled.div`
  margin-top: 1.5rem;
  padding: 1.2rem;
  background-color: #f5f5ff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(75, 73, 172, 0.07);
`;

const OwnerFeedbackTitle = styled.h4`
  font-weight: 600;
  color: #4b49ac;
  margin-bottom: 0.5rem;
  font-family: "Montserrat", sans-serif;
`;

const OwnerFeedbackText = styled.p`
  margin: 0;
  color: #666;
  font-family: "Open Sans", sans-serif;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #f8d7da;
  border-radius: 10px;
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
`;

export default ReviewSection;
