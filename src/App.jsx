import React, { useState, useEffect, useRef } from 'react';
import { Star, Plus, Trash2, Search, ChevronDown, X } from 'lucide-react';
import TourismForm from './components/TourismForm';
import './App.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const apiWisataUrl = `${BASE_URL}/wisatas`;
const apiDaerahUrl = `${BASE_URL}/daerahs`;
const apiProvinsiUrl = `${BASE_URL}/provinsis`;

// Searchable Dropdown Component
const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  label,
  searchKey = 'name',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option[searchKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option display text
  const selectedOption = options.find(
    (option) => option.id === parseInt(value)
  );
  const displayText = selectedOption ? selectedOption[searchKey] : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.id.toString());
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
      </label>

      <div
        className={`relative w-full px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed border-gray-300'
            : isOpen
            ? 'border-blue-500 ring-1 ring-blue-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span
            className={`truncate ${
              displayText ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            {displayText || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder={`Cari ${label.toLowerCase()}...`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm ${
                    option.id === parseInt(value)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option[searchKey]}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Tidak ada hasil ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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

  const getRegionName = (id_daerah) => {
    const region = regions.find((r) => r.id === id_daerah);
    return region ? region.nama_daerah : 'Unknown';
  };

  const getProvinceName = (id_provinsi) => {
    const province = provinces.find((p) => p.id === id_provinsi);
    return province ? province.nama_provinsi : 'Unknown';
  };

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
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Hapus Destinasi Wisata
              </h1>
              <p className="text-gray-600">
                Cari dan filter destinasi wisata yang ingin dihapus
              </p>
            </div>
            <button
              onClick={() => setCurrentView('main')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Kembali ke Beranda
            </button>
          </div>

          {/* Enhanced Search and Filter Section for Delete View */}
          <section className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Enhanced Search Bar */}
              <div className="mb-6 relative">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Cari Destinasi Wisata
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Cari berdasarkan nama wisata, alamat, provinsi, atau daerah..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Ketik nama destinasi untuk melihat hasil pencarian langsung
                </p>

                {/* Search Results Dropdown - Quick Preview Only */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-700">
                        Hasil Pencarian ({searchResults.length} destinasi
                        ditemukan)
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Lihat hasil lengkap di bawah atau klik destinasi untuk
                        melihat lokasinya
                      </p>
                    </div>
                    {searchResults.slice(0, 5).map((place) => {
                      const region = regions.find(
                        (r) => r.id === place.id_daerah
                      );
                      const province =
                        region &&
                        provinces.find((p) => p.id === region.id_provinsi);

                      return (
                        <div
                          key={place.id}
                          className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                          onClick={() => {
                            // Set the region and province to show this destination
                            if (region && province) {
                              setSelectedProvinsi(province.id.toString());
                              setSelectedDaerah(region.id.toString());
                            }
                            setShowSearchResults(false);
                          }}
                        >
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            {place.nama}
                          </h4>
                          <div className="flex items-center text-xs text-blue-600">
                            <span>
                              📍 {region?.nama_daerah || 'Unknown'},{' '}
                              {province?.nama_provinsi || 'Unknown'}
                            </span>
                            <div className="flex items-center ml-3 text-yellow-500">
                              <Star size={12} fill="#facc15" />
                              <span className="ml-1 text-gray-600">
                                {place.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {searchResults.length > 5 && (
                      <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
                        Dan {searchResults.length - 5} destinasi lainnya...
                        <br />
                        <span className="text-blue-600">
                          Lihat semua hasil di bawah
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* No Results Message */}
                {showSearchResults &&
                  searchResults.length === 0 &&
                  searchTerm && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
                      <p className="text-gray-500">
                        Tidak ada destinasi wisata yang ditemukan untuk "
                        {searchTerm}"
                      </p>
                    </div>
                  )}
              </div>

              {/* Dropdown Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SearchableDropdown
                  options={provinces}
                  value={selectedProvinsi}
                  onChange={setSelectedProvinsi}
                  placeholder="Semua Provinsi"
                  label="Filter Provinsi (Opsional)"
                  searchKey="nama_provinsi"
                />

                <SearchableDropdown
                  options={filteredRegions}
                  value={selectedDaerah}
                  onChange={setSelectedDaerah}
                  placeholder={
                    selectedProvinsi
                      ? 'Semua Daerah/Kota'
                      : 'Pilih Provinsi untuk filter daerah'
                  }
                  label="Filter Daerah/Kota (Opsional)"
                  searchKey="nama_daerah"
                  disabled={!selectedProvinsi}
                />
              </div>

              {/* Clear Filters Button */}
              {(selectedProvinsi || selectedDaerah || searchTerm) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedProvinsi('');
                      setSelectedDaerah('');
                      setSearchTerm('');
                      setShowSearchResults(false);
                      setSearchResults([]);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    🗑️ Hapus Semua Filter
                  </button>
                </div>
              )}

              {/* Filter Info */}
              {(selectedProvinsi || selectedDaerah || searchTerm) && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">🔍 Filter aktif:</span>
                    {searchTerm && ` Pencarian: "${searchTerm}"`}
                    {selectedProvinsi &&
                      ` | Provinsi: ${
                        provinces.find(
                          (p) => p.id === parseInt(selectedProvinsi)
                        )?.nama_provinsi
                      }`}
                    {selectedDaerah &&
                      ` | Daerah: ${
                        regions.find((r) => r.id === parseInt(selectedDaerah))
                          ?.nama_daerah
                      }`}
                  </p>
                </div>
              )}
            </div>
          </section>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2">Loading...</p>
            </div>
          ) : (
            <div>
              {/* Show Search Results */}
              {searchTerm && searchResults.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    🔍 Hasil Pencarian "{searchTerm}" untuk Dihapus
                  </h2>
                  <div className="mb-4 text-center text-sm text-gray-600">
                    Ditemukan {searchResults.length} destinasi wisata
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((place) => {
                      const region = regions.find(
                        (r) => r.id === place.id_daerah
                      );
                      const province =
                        region &&
                        provinces.find((p) => p.id === region.id_provinsi);

                      return (
                        <div
                          key={place.id}
                          className="bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition"
                        >
                          <h3 className="font-bold text-lg mb-2">
                            {place.nama}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {place.alamat}
                          </p>
                          <p className="text-blue-600 text-sm mb-2">
                            📍 {region?.nama_daerah || 'Unknown'},{' '}
                            {province?.nama_provinsi || 'Unknown'}
                          </p>
                          <div className="flex items-center text-yellow-500 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={
                                  i < Math.round(place.rating)
                                    ? '#facc15'
                                    : 'none'
                                }
                                strokeWidth={1.5}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">
                              {place.rating} / 5
                            </span>
                          </div>
                          <button
                            onClick={() => deleteTourismDestination(place.id)}
                            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                            Hapus Destinasi
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Show Regional Results (when province/region is selected) */}
              {selectedDaerah && !searchTerm && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    🗑️ Destinasi Wisata di{' '}
                    {getRegionName(parseInt(selectedDaerah))} untuk Dihapus
                  </h2>

                  {(() => {
                    const filteredData = tourismData.filter((place) => {
                      const matchesSearch =
                        searchTerm === '' ||
                        place.nama
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        place.alamat
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      return matchesSearch;
                    });

                    return (
                      <div>
                        <div className="mb-4 text-center text-sm text-gray-600">
                          Menampilkan {filteredData.length} destinasi wisata di{' '}
                          {getRegionName(parseInt(selectedDaerah))}
                        </div>

                        {filteredData.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.map((place) => (
                              <div
                                key={place.id}
                                className="bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition"
                              >
                                <h3 className="font-bold text-lg mb-2">
                                  {place.nama}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                  {place.alamat}
                                </p>
                                <p className="text-blue-600 text-sm mb-2">
                                  📍 {getRegionName(place.id_daerah)},{' '}
                                  {getProvinceName(
                                    regions.find(
                                      (r) => r.id === place.id_daerah
                                    )?.id_provinsi
                                  )}
                                </p>
                                <div className="flex items-center text-yellow-500 mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      fill={
                                        i < Math.round(place.rating)
                                          ? '#facc15'
                                          : 'none'
                                      }
                                      strokeWidth={1.5}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-2">
                                    {place.rating} / 5
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    deleteTourismDestination(place.id)
                                  }
                                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
                                  disabled={loading}
                                >
                                  <Trash2 size={16} />
                                  Hapus Destinasi
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : tourismData.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="bg-white rounded-lg shadow-md p-8">
                              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                                Belum Ada Destinasi
                              </h3>
                              <p className="text-gray-600">
                                Belum ada destinasi wisata yang terdaftar di
                                daerah ini.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="bg-white rounded-lg shadow-md p-8">
                              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                                Tidak Ada Hasil Ditemukan
                              </h3>
                              <p className="text-gray-600">
                                Tidak ada destinasi wisata yang sesuai dengan
                                pencarian "{searchTerm}".
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Show Filtered Results from All Data */}
              {searchTerm && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                      Tidak Ada Hasil Ditemukan
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Tidak ada destinasi wisata yang sesuai dengan pencarian "
                      {searchTerm}".
                    </p>
                    <p className="text-sm text-gray-500">
                      Coba ubah kata kunci pencarian atau gunakan filter
                      provinsi dan daerah.
                    </p>
                  </div>
                </div>
              )}

              {/* Show Combined Filter Results (both search and region selected) */}
              {selectedDaerah && searchTerm && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    🗑️ Destinasi di {getRegionName(parseInt(selectedDaerah))}
                    <span className="text-lg text-gray-600">
                      {' '}
                      (Filter: "{searchTerm}")
                    </span>
                  </h2>

                  {(() => {
                    const filteredData = tourismData.filter((place) => {
                      const matchesSearch =
                        place.nama
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        place.alamat
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      return matchesSearch;
                    });

                    return filteredData.length > 0 ? (
                      <div>
                        <div className="mb-4 text-center text-sm text-gray-600">
                          Menampilkan {filteredData.length} dari{' '}
                          {tourismData.length} destinasi di wilayah ini
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredData.map((place) => (
                            <div
                              key={place.id}
                              className="bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition"
                            >
                              <h3 className="font-bold text-lg mb-2">
                                {place.nama}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2">
                                {place.alamat}
                              </p>
                              <p className="text-blue-600 text-sm mb-2">
                                📍 {getRegionName(place.id_daerah)},{' '}
                                {getProvinceName(
                                  regions.find((r) => r.id === place.id_daerah)
                                    ?.id_provinsi
                                )}
                              </p>
                              <div className="flex items-center text-yellow-500 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    fill={
                                      i < Math.round(place.rating)
                                        ? '#facc15'
                                        : 'none'
                                    }
                                    strokeWidth={1.5}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">
                                  {place.rating} / 5
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  deleteTourismDestination(place.id)
                                }
                                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
                                disabled={loading}
                              >
                                <Trash2 size={16} />
                                Hapus Destinasi
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-md p-8">
                          <h3 className="text-xl font-semibold mb-4 text-gray-700">
                            Tidak Ada Hasil Ditemukan
                          </h3>
                          <p className="text-gray-600">
                            Tidak ada destinasi wisata yang sesuai dengan
                            pencarian "{searchTerm}" di{' '}
                            {getRegionName(parseInt(selectedDaerah))}.
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Default Welcome Message */}
              {!selectedDaerah && !searchTerm && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                      Pilih Destinasi untuk Dihapus
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Gunakan kotak pencarian di atas untuk mencari destinasi
                      wisata secara langsung, atau pilih provinsi dan daerah
                      untuk melihat destinasi wisata yang dapat dihapus.
                    </p>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
                      <p className="text-sm text-red-700">
                        ⚠️ <span className="font-semibold">Peringatan:</span>{' '}
                        Tindakan penghapusan tidak dapat dibatalkan. Pastikan
                        Anda yakin sebelum menghapus destinasi wisata.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main view
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-sans text-gray-800 p-6">
      {/* Navigation Bar */}
      <nav className="max-w-5xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-gray-800">
                Wisata Jawa Timur
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Tambah Wisata
              </button>
              <button
                onClick={() => setCurrentView('delete')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <Trash2 size={18} />
                Hapus Wisata
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto text-center py-10">
        <h1 className="text-4xl font-bold mb-4">
          Jelajahi Tempat Wisata di Jawa Timur
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Cari destinasi wisata atau pilih provinsi dan daerah untuk melihat
          destinasi wisata menarik.
        </p>
      </header>

      {/* Enhanced Search and Filter Section */}
      <section className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Enhanced Tourism Search Bar */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Cari Destinasi Wisata
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Cari berdasarkan nama wisata, alamat, provinsi, atau daerah..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              💡 Ketik nama destinasi untuk melihat hasil pencarian langsung
            </p>

            {/* Search Results Dropdown - Quick Preview Only */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-700">
                    Hasil Pencarian ({searchResults.length} destinasi ditemukan)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lihat hasil lengkap di bawah atau klik destinasi untuk
                    melihat lokasinya
                  </p>
                </div>
                {searchResults.slice(0, 5).map((place) => {
                  const region = regions.find((r) => r.id === place.id_daerah);
                  const province =
                    region &&
                    provinces.find((p) => p.id === region.id_provinsi);

                  return (
                    <div
                      key={place.id}
                      className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                      onClick={() => {
                        // Set the region and province to show this destination
                        if (region && province) {
                          setSelectedProvinsi(province.id.toString());
                          setSelectedDaerah(region.id.toString());
                        }
                        setShowSearchResults(false);
                      }}
                    >
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {place.nama}
                      </h4>
                      <div className="flex items-center text-xs text-blue-600">
                        <span>
                          📍 {region?.nama_daerah || 'Unknown'},{' '}
                          {province?.nama_provinsi || 'Unknown'}
                        </span>
                        <div className="flex items-center ml-3 text-yellow-500">
                          <Star size={12} fill="#facc15" />
                          <span className="ml-1 text-gray-600">
                            {place.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {searchResults.length > 5 && (
                  <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
                    Dan {searchResults.length - 5} destinasi lainnya...
                    <br />
                    <span className="text-blue-600">
                      Lihat semua hasil di bawah
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* No Results Message */}
            {showSearchResults && searchResults.length === 0 && searchTerm && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
                <p className="text-gray-500">
                  Tidak ada destinasi wisata yang ditemukan untuk "{searchTerm}"
                </p>
              </div>
            )}
          </div>

          {/* Searchable Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SearchableDropdown
              options={provinces}
              value={selectedProvinsi}
              onChange={setSelectedProvinsi}
              placeholder="Pilih Provinsi"
              label="Provinsi"
              searchKey="nama_provinsi"
            />

            <SearchableDropdown
              options={filteredRegions}
              value={selectedDaerah}
              onChange={setSelectedDaerah}
              placeholder={
                selectedProvinsi
                  ? 'Pilih Daerah/Kota'
                  : 'Pilih Provinsi terlebih dahulu'
              }
              label="Daerah/Kota"
              searchKey="nama_daerah"
              disabled={!selectedProvinsi}
            />
          </div>

          {/* Clear Search and Filters */}
          {(searchTerm || selectedProvinsi || selectedDaerah) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedProvinsi('');
                  setSelectedDaerah('');
                  setShowSearchResults(false);
                  setSearchResults([]);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                🗑️ Hapus Semua Filter
              </button>
            </div>
          )}

          {/* Selected Info */}
          {selectedProvinsi && selectedDaerah && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">📍 Menampilkan wisata di:</span>{' '}
                {
                  regions.find((r) => r.id === parseInt(selectedDaerah))
                    ?.nama_daerah
                }
                ,{' '}
                {
                  provinces.find((p) => p.id === parseInt(selectedProvinsi))
                    ?.nama_provinsi
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area - Show Results Here */}
      <main className="max-w-4xl mx-auto">
        {/* Show Search Results */}
        {searchTerm && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Hasil Pencarian "{searchTerm}"
            </h2>
            <div className="mb-4 text-center text-sm text-gray-600">
              Ditemukan {searchResults.length} destinasi wisata
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map((place) => {
                const region = regions.find((r) => r.id === place.id_daerah);
                const province =
                  region && provinces.find((p) => p.id === region.id_provinsi);

                return (
                  <div
                    key={place.id}
                    className="bg-white rounded-2xl shadow-lg p-5 border hover:border-blue-300 transition"
                  >
                    <h3 className="text-lg font-bold mb-1">{place.nama}</h3>
                    <p className="text-sm text-gray-600 mb-2">{place.alamat}</p>
                    <p className="text-xs text-blue-600 mb-3">
                      📍 {region?.nama_daerah || 'Unknown'},{' '}
                      {province?.nama_provinsi || 'Unknown'}
                    </p>
                    <div className="flex items-center text-yellow-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={
                            i < Math.round(place.rating) ? '#facc15' : 'none'
                          }
                          strokeWidth={1.5}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {place.rating} / 5
                      </span>
                    </div>
                    <a
                      href={place.link_gmaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Lihat di Google Maps →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Show Regional Results (when province/region is selected) */}
        {selectedDaerah && !searchTerm && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Destinasi Wisata di{' '}
              {
                regions.find((r) => r.id === parseInt(selectedDaerah))
                  ?.nama_daerah
              }
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2">Memuat data wisata...</p>
              </div>
            ) : tourismData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tourismData.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-2xl shadow-lg p-5 border hover:border-blue-300 transition"
                  >
                    <h3 className="text-lg font-bold mb-1">{place.nama}</h3>
                    <p className="text-sm text-gray-600 mb-3">{place.alamat}</p>
                    <div className="flex items-center text-yellow-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={
                            i < Math.round(place.rating) ? '#facc15' : 'none'
                          }
                          strokeWidth={1.5}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {place.rating} / 5
                      </span>
                    </div>
                    <a
                      href={place.link_gmaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Lihat di Google Maps →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Belum ada data tempat wisata di daerah ini.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Show Filtered Regional Results (when both search term and region are selected) */}
        {selectedDaerah && searchTerm && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Destinasi di{' '}
              {
                regions.find((r) => r.id === parseInt(selectedDaerah))
                  ?.nama_daerah
              }
              <span className="text-lg text-gray-600">
                {' '}
                (Filter: "{searchTerm}")
              </span>
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2">Memuat data wisata...</p>
              </div>
            ) : filteredTourismData.length > 0 ? (
              <div>
                <div className="mb-4 text-center text-sm text-gray-600">
                  Menampilkan {filteredTourismData.length} dari{' '}
                  {tourismData.length} destinasi di wilayah ini
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTourismData.map((place) => (
                    <div
                      key={place.id}
                      className="bg-white rounded-2xl shadow-lg p-5 border hover:border-blue-300 transition"
                    >
                      <h3 className="font-bold text-lg mb-2">{place.nama}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {place.alamat}
                      </p>
                      <p className="text-blue-600 text-sm mb-2">
                        📍 {getRegionName(place.id_daerah)},{' '}
                        {getProvinceName(
                          regions.find((r) => r.id === place.id_daerah)
                            ?.id_provinsi
                        )}
                      </p>
                      <div className="flex items-center text-yellow-500 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={
                              i < Math.round(place.rating) ? '#facc15' : 'none'
                            }
                            strokeWidth={1.5}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {place.rating} / 5
                        </span>
                      </div>
                      <a
                        href={place.link_gmaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Lihat di Google Maps →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Tidak ada hasil yang sesuai dengan pencarian "{searchTerm}" di
                  daerah ini.
                </p>
              </div>
            )}
          </div>
        )}

        {/* No Results Message for Search */}
        {searchTerm && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Tidak Ada Hasil Ditemukan
              </h3>
              <p className="text-gray-600">
                Tidak ada destinasi wisata yang sesuai dengan pencarian "
                {searchTerm}".
                <br />
                Coba gunakan kata kunci yang berbeda atau jelajahi berdasarkan
                provinsi dan daerah.
              </p>
            </div>
          </div>
        )}

        {/* Default Welcome Message */}
        {!selectedDaerah && !searchTerm && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Selamat Datang di Portal Wisata Jawa Timur
              </h3>
              <p className="text-gray-600">
                Gunakan kotak pencarian di atas untuk mencari destinasi wisata
                secara langsung, atau pilih provinsi dan daerah untuk
                menjelajahi destinasi wisata yang tersedia.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 mt-16">
        &copy; {new Date().getFullYear()} Wisata Jawa Timur. Seluruh hak cipta
        dilindungi.
      </footer>
    </div>
  );
};

export default App;
