import React from 'react';
import { Search } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  selectedProvinsi,
  onProvinsiChange,
  selectedDaerah,
  onDaerahChange,
  provinces,
  filteredRegions,
  searchResults,
  showSearchResults,
  regions,
  onClearFilters,
  onSearchResultClick,
  onCloseSearchResults,
  isDeleteMode = false,
}) => {
  return (
    <section className="max-w-4xl mx-auto mb-12">
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
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Cari berdasarkan nama wisata, alamat, provinsi, atau daerah..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            💡 Ketik nama destinasi untuk melihat hasil pencarian langsung
          </p>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">
                  Hasil Pencarian ({searchResults.length} destinasi ditemukan)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isDeleteMode 
                    ? 'Lihat hasil lengkap di bawah atau klik destinasi untuk melihat lokasinya'
                    : 'Lihat hasil lengkap di bawah atau klik destinasi untuk melihat lokasinya'
                  }
                </p>
              </div>
              {searchResults.slice(0, 5).map((place) => {
                const region = regions.find((r) => r.id === place.id_daerah);
                const province = region && provinces.find((p) => p.id === region.id_provinsi);

                return (
                  <div
                    key={place.id}
                    className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                    onClick={() => onSearchResultClick(place, region, province)}
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
                        <span>⭐</span>
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

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SearchableDropdown
            options={provinces}
            value={selectedProvinsi}
            onChange={onProvinsiChange}
            placeholder={isDeleteMode ? "Semua Provinsi" : "Pilih Provinsi"}
            label={isDeleteMode ? "Filter Provinsi (Opsional)" : "Provinsi"}
            searchKey="nama_provinsi"
          />

          <SearchableDropdown
            options={filteredRegions}
            value={selectedDaerah}
            onChange={onDaerahChange}
            placeholder={
              selectedProvinsi
                ? isDeleteMode ? 'Semua Daerah/Kota' : 'Pilih Daerah/Kota'
                : 'Pilih Provinsi terlebih dahulu'
            }
            label={isDeleteMode ? "Filter Daerah/Kota (Opsional)" : "Daerah/Kota"}
            searchKey="nama_daerah"
            disabled={!selectedProvinsi}
          />
        </div>

        {/* Clear Filters Button */}
        {(selectedProvinsi || selectedDaerah || searchTerm) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClearFilters}
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
  );
};

export default SearchAndFilter;