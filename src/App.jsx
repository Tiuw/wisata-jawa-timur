import React, { useState, useEffect } from "react";
import TourismForm from "./components/TourismForm";
import MainView from "./components/MainView";
import DeleteTourismView from "./components/DeleteTourismView";
import "./App.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const apiWisataUrl = `${BASE_URL}/wisatas`;
const apiDaerahUrl = `${BASE_URL}/daerahs`;
const apiProvinsiUrl = `${BASE_URL}/provinsis`;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedDaerah, setSelectedDaerah] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [tourismData, setTourismData] = useState([]);
  const [allTourismData, setAllTourismData] = useState([]);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("main"); // 'main', 'add', 'delete'
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch all tourism data for delete feature
  const fetchAllTourismData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/wisatas`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Fetched all tourism data:", data.length, "items"); // Debug log
        setAllTourismData(data);
        return data; // Return the data for immediate use
      }
    } catch (err) {
      console.error("Error fetching all tourism data:", err);
    }
    return [];
  };

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      const response = await fetch(apiProvinsiUrl, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProvinces(data);
      }
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  };

  // Fetch list of regions (daerah)
  const fetchRegions = async () => {
    try {
      const response = await fetch(apiDaerahUrl, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRegions(data);
      } else {
        setError("Gagal mengambil data daerah.");
      }
    } catch (err) {
      setError("Gagal mengambil data daerah: " + err.message);
    }
  };

  const fetchTourismData = async (regionId) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiWisataUrl}/daerah/${regionId}`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTourismData(data);
        setError(null);
      } else {
        setTourismData([]);
        setError(data.message || "Terjadi kesalahan saat mengambil data.");
      }
    } catch (err) {
      setError("Gagal mengambil data wisata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced search function that works across all loaded data
  const searchAllTourismData = (searchTerm, dataToSearch = null) => {
    console.log("Searching for:", searchTerm); // Debug log

    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    // Use provided data or fall back to existing data
    let allDataToSearch = dataToSearch || [...allTourismData];

    // Also include current tourism data if available
    if (tourismData.length > 0) {
      allDataToSearch = [...allDataToSearch, ...tourismData];
    }

    console.log("Data to search:", allDataToSearch.length, "items"); // Debug log

    // Remove duplicates based on id
    const uniqueData = allDataToSearch.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );

    console.log("Unique data:", uniqueData.length, "items"); // Debug log

    // Search only in wisata names (remove alamat, region, and province search)
    const results = uniqueData.filter((place) => {
      return place.nama.toLowerCase().includes(lowerSearchTerm);
    });

    console.log("Search results:", results.length, "items"); // Debug log
    setSearchResults(results);
    setShowSearchResults(results.length > 0 || searchTerm.length > 0);
    return results;
  };

  // Create new tourism destination
  const createTourismDestination = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wisatas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log("New tourism data created:", responseData); // Debug log

        setCurrentView("main");
        setError(null);

        // Fetch fresh data immediately
        const freshAllData = await fetchAllTourismData();

        // Clear and reset search results
        setSearchResults([]);
        setShowSearchResults(false);

        // Refresh data if user has selected a region
        if (selectedDaerah) {
          await fetchTourismData(selectedDaerah);
        }

        // If there's an active search term, re-run the search with fresh data
        if (searchTerm) {
          console.log(
            "Re-running search with fresh data for term:",
            searchTerm,
          ); // Debug log
          // Use the fresh data directly instead of waiting for state update
          setTimeout(() => {
            searchAllTourismData(searchTerm, freshAllData);
          }, 200);
        }
      } else {
        setError(responseData.message || "Gagal menambahkan destinasi wisata.");
      }
    } catch (err) {
      setError("Gagal menambahkan destinasi wisata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete tourism destination
  const deleteTourismDestination = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus destinasi ini?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wisatas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      });
      if (response.ok) {
        // Fetch fresh data immediately
        const freshAllData = await fetchAllTourismData();
        setError(null);

        // Clear search results to force fresh search
        setSearchResults([]);
        setShowSearchResults(false);

        // Refresh current view data if needed
        if (selectedDaerah) {
          await fetchTourismData(selectedDaerah);
        }

        // If there's an active search term, re-run the search with fresh data
        if (searchTerm) {
          setTimeout(() => {
            searchAllTourismData(searchTerm, freshAllData);
          }, 200);
        }
      } else {
        setError("Gagal menghapus destinasi wisata.");
      }
    } catch (err) {
      setError("Gagal menghapus destinasi wisata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter regions based on selected province
  useEffect(() => {
    if (selectedProvinsi) {
      const filtered = regions.filter(
        (region) => region.id_provinsi === parseInt(selectedProvinsi),
      );
      setFilteredRegions(filtered);
      setSelectedDaerah(""); // Reset selected region when province changes
      setTourismData([]); // Clear tourism data
    } else {
      setFilteredRegions([]);
      setSelectedDaerah("");
      setTourismData([]);
    }
  }, [selectedProvinsi, regions]);

  // Fetch tourism data when region changes
  useEffect(() => {
    if (selectedDaerah) {
      fetchTourismData(selectedDaerah);
    } else {
      setTourismData([]);
    }
  }, [selectedDaerah]);

  // Fetch data on component mount
  useEffect(() => {
    fetchProvinces();
    fetchRegions();
    fetchAllTourismData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchAllTourismData(value);
  };

  // Handle search result click
  const handleSearchResultClick = (place, region, province) => {
    if (region && province) {
      setSelectedProvinsi(province.id.toString());
      setSelectedDaerah(region.id.toString());
    }
    setShowSearchResults(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedProvinsi("");
    setSelectedDaerah("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // Load more data for search by fetching from different regions - IMPROVED VERSION
  const loadMoreDataForSearch = async () => {
    try {
      // First try to get all data from the main endpoint
      const allData = await fetchAllTourismData();
      if (allData.length > 0) {
        console.log("Loaded", allData.length, "items from main endpoint"); // Debug log
        return; // If we got data from main endpoint, we're done
      }

      // Fallback: fetch from individual regions if main endpoint doesn't work
      const allTourismPlaces = [];
      for (const region of regions.slice(0, 10)) {
        try {
          const response = await fetch(`${apiWisataUrl}/daerah/${region.id}`, {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              Accept: "application/json",
            },
          });

          if (response.ok) {
            const regionData = await response.json();
            allTourismPlaces.push(...regionData);
          }
        } catch (regionErr) {
          console.warn(
            `Error fetching data for region ${region.id}:`,
            regionErr,
          );
        }
      }

      if (allTourismPlaces.length > 0) {
        setAllTourismData(allTourismPlaces);
        console.log("Loaded", allTourismPlaces.length, "items from regions"); // Debug log
      }
    } catch (err) {
      console.error("Error loading additional data for search:", err);
    }
  };

  // Load additional data when regions are available
  useEffect(() => {
    if (regions.length > 0 && allTourismData.length === 0) {
      loadMoreDataForSearch();
    }
  }, [regions]);

  // Re-run search when allTourismData is updated and there's an active search term
  useEffect(() => {
    if (searchTerm && allTourismData.length > 0) {
      console.log("Re-running search due to data update"); // Debug log
      searchAllTourismData(searchTerm);
    }
  }, [allTourismData, regions, provinces]); // Include regions and provinces as dependencies

  // Filter tourism data based on search term for selected region
  const filteredTourismData = tourismData.filter((place) =>
    place.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Render Add Tourism Form
  if (currentView === "add") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
        <TourismForm
          onBack={() => setCurrentView("main")}
          onSubmit={createTourismDestination}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  // Render Delete Tourism View
  if (currentView === "delete") {
    return (
      <DeleteTourismView
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedProvinsi={selectedProvinsi}
        onProvinsiChange={setSelectedProvinsi}
        selectedDaerah={selectedDaerah}
        onDaerahChange={setSelectedDaerah}
        provinces={provinces}
        regions={regions}
        filteredRegions={filteredRegions}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        onSearchResultClick={handleSearchResultClick}
        onClearFilters={handleClearFilters}
        onBack={() => setCurrentView("main")}
        error={error}
        loading={loading}
        tourismData={tourismData}
        onDelete={deleteTourismDestination}
        allTourismData={allTourismData}
      />
    );
  }

  // Main view
  return (
    <MainView
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      selectedProvinsi={selectedProvinsi}
      onProvinsiChange={setSelectedProvinsi}
      selectedDaerah={selectedDaerah}
      onDaerahChange={setSelectedDaerah}
      provinces={provinces}
      regions={regions}
      filteredRegions={filteredRegions}
      searchResults={searchResults}
      showSearchResults={showSearchResults}
      onSearchResultClick={handleSearchResultClick}
      onClearFilters={handleClearFilters}
      onAddTourism={() => setCurrentView("add")}
      onDeleteTourism={() => setCurrentView("delete")}
      tourismData={tourismData}
      filteredTourismData={filteredTourismData}
      loading={loading}
      error={error}
    />
  );
};

export default App;
