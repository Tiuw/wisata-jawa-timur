import React, { useState, useEffect } from 'react';
import TourismForm from './components/TourismForm';
import MainView from './components/MainView';
import DeleteTourismView from './components/DeleteTourismView';
import './App.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const apiWisataUrl = `${BASE_URL}/wisatas`;
const apiDaerahUrl = `${BASE_URL}/daerahs`;
const apiProvinsiUrl = `${BASE_URL}/provinsis`;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvinsi, setSelectedProvinsi] = useState('');
  const [selectedDaerah, setSelectedDaerah] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [tourismData, setTourismData] = useState([]);
  const [allTourismData, setAllTourismData] = useState([]);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'add', 'delete'
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch all tourism data for delete feature
  const fetchAllTourismData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/wisatas`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAllTourismData(data);
      }
    } catch (err) {
      console.error('Error fetching all tourism data:', err);
    }
  };

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      const response = await fetch(apiProvinsiUrl, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProvinces(data);
      }
    } catch (err) {
      console.error('Error fetching provinces:', err);
    }
  };

  // Fetch list of regions (daerah)
  const fetchRegions = async () => {
    try {
      const response = await fetch(apiDaerahUrl, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRegions(data);
      } else {
        setError('Gagal mengambil data daerah.');
      }
    } catch (err) {
      setError('Gagal mengambil data daerah: ' + err.message);
    }
  };

  const fetchTourismData = async (regionId) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiWisataUrl}/daerah/${regionId}`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTourismData(data);
        setError(null);
      } else {
        setTourismData([]);
        setError(data.message || 'Terjadi kesalahan saat mengambil data.');
      }
    } catch (err) {
      setError('Gagal mengambil data wisata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new tourism destination
  const createTourismDestination = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/wisatas`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentView('main');
        setError(null);
        // Refresh data if user has selected a region
        if (selectedDaerah) {
          fetchTourismData(selectedDaerah);
        }
        await fetchAllTourismData(); // Refresh all data for delete view
      } else {
        setError(data.message || 'Gagal menambahkan destinasi wisata.');
      }
    } catch (err) {
      setError('Gagal menambahkan destinasi wisata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete tourism destination
  const deleteTourismDestination = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus destinasi ini?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wisatas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        await fetchAllTourismData();
        setError(null);
        // Refresh current view data if needed
        if (selectedDaerah) {
          fetchTourismData(selectedDaerah);
        }
      } else {
        setError('Gagal menghapus destinasi wisata.');
      }
    } catch (err) {
      setError('Gagal menghapus destinasi wisata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter regions based on selected province
  useEffect(() => {
    if (selectedProvinsi) {
      const filtered = regions.filter(
        (region) => region.id_provinsi === parseInt(selectedProvinsi)
      );
      setFilteredRegions(filtered);
      setSelectedDaerah(''); // Reset selected region when province changes
      setTourismData([]); // Clear tourism data
    } else {
      setFilteredRegions([]);
      setSelectedDaerah('');
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

  // Enhanced search function that works across all loaded data
  const searchAllTourismData = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    // Search in current tourismData if available
    let allDataToSearch = [...tourismData];

    // If we have allTourismData from previous loads, include it
    if (allTourismData.length > 0) {
      allDataToSearch = [...allTourismData];
    }

    // Remove duplicates based on id
    const uniqueData = allDataToSearch.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    const results = uniqueData.filter((place) => {
      // Search in tourism destination name and address
      const matchesTourismData =
        place.nama.toLowerCase().includes(lowerSearchTerm) ||
        place.alamat.toLowerCase().includes(lowerSearchTerm);

      // Search in region/city name
      const region = regions.find((r) => r.id === place.id_daerah);
      const matchesRegion =
        region && region.nama_daerah.toLowerCase().includes(lowerSearchTerm);

      // Search in province name
      const province =
        region && provinces.find((p) => p.id === region.id_provinsi);
      const matchesProvince =
        province &&
        province.nama_provinsi.toLowerCase().includes(lowerSearchTerm);

      return matchesTourismData || matchesRegion || matchesProvince;
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

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
    setSearchTerm('');
    setSelectedProvinsi('');
    setSelectedDaerah('');
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // Load more data for search by fetching from different regions
  const loadMoreDataForSearch = async () => {
    try {
      const allTourismPlaces = [];

      // Fetch data from all regions to build comprehensive search
      for (const region of regions.slice(0, 10)) {
        // Limit to first 10 regions to avoid too many requests
        try {
          const response = await fetch(`${apiWisataUrl}/daerah/${region.id}`, {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            const regionData = await response.json();
            allTourismPlaces.push(...regionData);
          }
        } catch (regionErr) {
          console.warn(
            `Error fetching data for region ${region.id}:`,
            regionErr
          );
        }
      }

      setAllTourismData(allTourismPlaces);
    } catch (err) {
      console.error('Error loading additional data for search:', err);
    }
  };

  // Load additional data when regions are available
  useEffect(() => {
    if (regions.length > 0 && allTourismData.length === 0) {
      loadMoreDataForSearch();
    }
  }, [regions]);

  // Filter tourism data based on search term for selected region
  const filteredTourismData = tourismData.filter(
    (place) =>
      place.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render Add Tourism Form
  if (currentView === 'add') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
        <TourismForm
          onBack={() => setCurrentView('main')}
          onSubmit={createTourismDestination}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  // Render Delete Tourism View
  if (currentView === 'delete') {
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
        onBack={() => setCurrentView('main')}
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
      onAddTourism={() => setCurrentView('add')}
      onDeleteTourism={() => setCurrentView('delete')}
      tourismData={tourismData}
      filteredTourismData={filteredTourismData}
      loading={loading}
      error={error}
    />
  );
};

export default App;
