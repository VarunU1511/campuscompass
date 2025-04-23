import { useState, useEffect } from "react";
import styled from "styled-components";
import SearchFilter from "../components/SearchFilter";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../config/config";

// Simple inline components instead of separate files
const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-family: "Open Sans", sans-serif;
  font-size: 1.1rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-family: "Open Sans", sans-serif;
  font-size: 1.1rem;
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const SearchWrapper = styled.div`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 2.5rem;
  background: linear-gradient(
    135deg,
    rgba(244, 244, 250, 0.97) 0%,
    rgba(225, 225, 253, 0.71) 100%
  );
  border-radius: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #333;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FiltersSection = styled.div`
  margin-bottom: 2.5rem;
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ListingImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const ListingContent = styled.div`
  padding: 1.5rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin-bottom: 0.8rem;
`;

const ListingLocation = styled.p`
  font-size: 1rem;
  color: #666;
  font-family: "Open Sans", sans-serif;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
`;

const ListingPrice = styled.p`
  font-size: 1.1rem;
  color: #4b49ac;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Detail = styled.p`
  font-size: 1rem;
  color: #666;
  font-family: "Open Sans", sans-serif;
  margin-bottom: 0.5rem;
`;

const ViewButton = styled.button`
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.active ? "#4b49ac" : "white")};
  color: ${(props) => (props.active ? "white" : "#666")};
  border: 1px solid ${(props) => (props.active ? "#4b49ac" : "#e0e0e0")};
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;

  &:hover {
    background-color: ${(props) => (props.active ? "#3f3e8f" : "#f5f5f5")};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
  font-family: "Open Sans", sans-serif;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 20px;
  margin-bottom: 2rem;
`;

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [originalResults, setOriginalResults] = useState([]); // Store original results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    location: "",
    listingType: "",
  });

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // If no search query, don't make the request
        if (!searchQuery) {
          setSearchResults([]);
          setLoading(false);
          return;
        }

        // Use the listingService to fetch ALL listings instead of just accommodations
        const response = await axios.get(`${config.API_URL}/api/listings`, {
          params: {
            search: searchQuery,
          },
        });

        if (response.data.success) {
          // Combine all listing types into a single array
          const allListings = [
            ...(response.data.listings.accommodations || []),
            ...(response.data.listings.restaurants || []),
            ...(response.data.listings.shops || []),
            ...(response.data.listings.messes || []),
          ];

          // Normalize search query for case-insensitive partial matching
          const normalizedQuery = searchQuery.toLowerCase().trim();

          // Filter results based on partial matches in title, location, or description
          const filteredResults = allListings.filter((listing) => {
            const title = (listing.title || "").toLowerCase();
            const location = (listing.location || "").toLowerCase();
            const description = (listing.description || "").toLowerCase();
            const amenities = Array.isArray(listing.amenities)
              ? listing.amenities.join(" ").toLowerCase()
              : "";

            // Check if any field contains the search query as a substring
            return (
              title.includes(normalizedQuery) ||
              location.includes(normalizedQuery) ||
              description.includes(normalizedQuery) ||
              amenities.includes(normalizedQuery)
            );
          });

          setOriginalResults(filteredResults); // Store the original search results
          setSearchResults(filteredResults);
        } else {
          setError("No results found");
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error performing search:", error);
        setError("Failed to perform search. Please try again.");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change

    // Apply filters to the original search results instead of current filtered results
    applyFilters(originalResults, newFilters);
  };

  // Add these two handler functions
  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    const newFilters = { ...filters, location: newLocation };
    setFilters(newFilters);
    applyFilters(originalResults, newFilters);
  };

  const handleListingTypeChange = (e) => {
    const newListingType = e.target.value;
    const newFilters = { ...filters, listingType: newListingType };
    setFilters(newFilters);
    applyFilters(originalResults, newFilters);
  };

  const applyFilters = (results, currentFilters) => {
    // Start with a copy of the original results
    let filteredResults = [...results];

    // Check if any filter is active
    const hasActiveFilters =
      currentFilters.location || currentFilters.listingType;

    // If no active filters, restore original results
    if (!hasActiveFilters) {
      setSearchResults(results);
      return;
    }

    // Filter by location
    if (currentFilters.location) {
      filteredResults = filteredResults.filter((listing) =>
        listing.location
          .toLowerCase()
          .includes(currentFilters.location.toLowerCase())
      );
    }

    // // Filter by listing type
    // if (currentFilters.listingType) {
    //   filteredResults = filteredResults.filter((listing) => {
    //     if (!listing.__t) {
    //       // If no __t field, assume it's an accommodation
    //       return currentFilters.listingType === "accommodation";
    //     }

    //     const type = listing.__t.toLowerCase();

    //     switch (currentFilters.listingType) {
    //       case "accommodation":
    //         return (
    //           type.includes("accommodation") || type === "accommodationlisting"
    //         );
    //       case "restaurant":
    //         return type.includes("restaurant") || type === "restaurantlisting";
    //       case "shop":
    //         return type.includes("shop") || type === "shoplisting";
    //       default:
    //         return true;
    //     }
    //   });
    // }

    setSearchResults(filteredResults);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Clean up the path and ensure proper directory structure
    const cleanPath = imagePath
      .split("\\")
      .pop() // Remove Windows-style path
      .split("/")
      .pop(); // Get just the filename

    return `${config.API_URL}/uploads/listings/${cleanPath}`;
  };

  // New filter components that will be directly in the base container
  const FilterRow = styled.div`
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2.5rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  `;

  const FilterGroup = styled.div`
    flex: 1;
  `;

  const FilterLabel = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
    font-family: "Open Sans", sans-serif;
  `;

  const FilterInput = styled.input`
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 14px;
    font-size: 1rem;
    font-family: "Open Sans", sans-serif;
    background: #fff;
    color: #333;
    transition: all 0.2s ease;
    box-sizing: border-box;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

    &:focus {
      border-color: #4b49ac;
      outline: none;
      box-shadow: 0 0 0 2px rgba(75, 73, 172, 0.08);
    }

    &::placeholder {
      color: #aaa;
    }
  `;

  const FilterSelect = styled.select`
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 14px;
    font-size: 1rem;
    font-family: "Open Sans", sans-serif;
    background: #fff;
    color: #333;
    transition: all 0.2s ease;
    box-sizing: border-box;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    appearance: menulist; /* Show the dropdown arrow */

    &:focus {
      border-color: #4b49ac;
      outline: none;
      box-shadow: 0 0 0 2px rgba(75, 73, 172, 0.08);
    }
  `;

  return (
    <SearchWrapper>
      <Title>Search Results for "{searchQuery || ""}"</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Direct filters in the base container */}
      <FilterRow>
        <FilterGroup>
          <FilterLabel>Location:</FilterLabel>
          <FilterInput
            type="text"
            placeholder="Enter location"
            value={filters.location}
            onChange={handleLocationChange}
          />
        </FilterGroup>
        {/* <FilterGroup>
          <FilterLabel>Listing Type:</FilterLabel>
          <FilterSelect
            value={filters.listingType}
            onChange={handleListingTypeChange}
          >
            <option value="">All Types</option>
            <option value="accommodation">Accommodation</option>
            <option value="restaurant">Restaurant</option>
            <option value="shop">Shop</option>
          </FilterSelect>
        </FilterGroup> */}
      </FilterRow>

      <SearchResults>
        {loading ? (
          <LoadingSpinner>Loading...</LoadingSpinner>
        ) : searchResults.length === 0 ? (
          <NoResults>No results found for your search.</NoResults>
        ) : (
          <ResultsGrid>
            {searchResults.map((listing) => (
              <ListingCard key={listing._id}>
                {listing.images && listing.images[0] && (
                  <ListingImage
                    src={getImageUrl(listing.images[0])}
                    alt={listing.title}
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      console.log("Listing details:", {
                        listingId: listing._id,
                        imagePath: listing.images[0],
                      });
                    }}
                    crossOrigin="anonymous"
                    style={{ display: "block" }}
                  />
                )}
                <ListingContent>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <ListingLocation>📍 {listing.location}</ListingLocation>

                  {/* Display price differently based on listing type */}
                  {listing.price && (
                    <ListingPrice>
                      {listing.__t === "RestaurantListing" ||
                      listing.__t === "ShopListing"
                        ? `₹${listing.price} average`
                        : `₹${listing.price}/month`}
                    </ListingPrice>
                  )}

                  {/* Show type-specific details */}
                  {listing.roomType && (
                    <Detail>Room Type: {listing.roomType}</Detail>
                  )}
                  {listing.cuisineType && (
                    <Detail>Cuisine: {listing.cuisineType.join(", ")}</Detail>
                  )}
                  {listing.shopCategory && (
                    <Detail>Category: {listing.shopCategory}</Detail>
                  )}

                  {/* Use different routes based on listing type */}
                  <ViewButton
                    onClick={() => {
                      const listingType = listing.__t
                        ? listing.__t.toLowerCase().replace("listing", "")
                        : "pg";
                      navigate(`/${listingType}/${listing._id}`);
                    }}
                  >
                    View Details
                  </ViewButton>
                </ListingContent>
              </ListingCard>
            ))}
          </ResultsGrid>
        )}
      </SearchResults>
    </SearchWrapper>
  );
};

export default Search;
