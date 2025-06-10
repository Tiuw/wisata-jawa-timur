import React from 'react';
import { Search, Filter } from 'lucide-react';
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
  isDeleteMode = false,
}) => {
  return (
    <section className="max-w-5xl mx-auto mb-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Enhanced Search Bar */}
        <div className="mb-8 relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
              <Search className="text-white" size={20} />
            </div>
            <label className="text-gray-800 text-lg font-bold">
              🔍 Cari Nama Destinasi Wisata
            </label>
          </div>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={24}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm"
              placeholder="Ketik nama destinasi wisata (contoh: Candi Borobudur, Pantai Malang Selatan...)"
            />
          </div>
          <div className="flex items-center mt-3 text-sm text-gray-600">
            <span className="bg-blue-50 px-3 py-1 rounded-full mr-2">💡 Tips:</span>
            <span>Pencarian hanya berdasarkan nama destinasi wisata saja</span>
          </div>

          {/* Enhanced Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      Hasil Pencarian ({searchResults.length} destinasi ditemukan)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {isDeleteMode 
                        ? 'Pilih destinasi untuk dihapus atau lihat semua hasil di bawah'
                        : 'Pilih destinasi untuk melihat lokasinya atau lihat semua hasil di bawah'
                      }
                    </p>
                  </div>
                </div>
              </div>
              {searchResults.slice(0, 5).map((place) => {
                const region = regions.find((r) => r.id === place.id_daerah);
                const province = region && provinces.find((p) => p.id === region.id_provinsi);

                return (
                  <div
                    key={place.id}
                    className="p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={() => onSearchResultClick(place, region, province)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                          <span className="text-lg">🏞️</span>
                          {place.nama}
                        </h4>
                        <div className="flex items-center text-sm text-blue-700 mb-1">
                          <span className="mr-2">📍</span>
                          <span className="font-medium">
                            {region?.nama_daerah || 'Unknown'}, {province?.nama_provinsi || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          <span className="truncate">{place.alamat}</span>
                        </div>
                      </div>
                      <div className="flex items-center ml-3 bg-yellow-100 px-3 py-1 rounded-full">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="font-semibold text-gray-700">{place.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {searchResults.length > 5 && (
                <div className="p-4 text-center bg-gradient-to-r from-gray-50 to-blue-50">
                  <p className="text-sm text-gray-600 font-medium">
                    🎯 Dan <span className="font-bold text-blue-600">{searchResults.length - 5}</span> destinasi lainnya...
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Lihat semua hasil di bagian bawah halaman
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No Results Message */}
          {showSearchResults && searchResults.length === 0 && searchTerm && (
            <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-6 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-700 font-medium">
                Tidak ada destinasi wisata yang ditemukan untuk "<span className="font-bold text-blue-600">{searchTerm}</span>"
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Coba gunakan kata kunci yang berbeda atau periksa ejaan nama destinasi
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Dropdown Filters */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <Filter className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              🎯 Filter Berdasarkan Lokasi
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <SearchableDropdown
                options={provinces}
                value={selectedProvinsi}
                onChange={onProvinsiChange}
                placeholder={isDeleteMode ? "Semua Provinsi" : "Pilih Provinsi"}
                label={isDeleteMode ? "🗺️ Filter Provinsi (Opsional)" : "🗺️ Provinsi"}
                searchKey="nama_provinsi"
              />
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <SearchableDropdown
                options={filteredRegions}
                value={selectedDaerah}
                onChange={onDaerahChange}
                placeholder={
                  selectedProvinsi
                    ? isDeleteMode ? 'Semua Daerah/Kota' : 'Pilih Daerah/Kota'
                    : 'Pilih Provinsi terlebih dahulu'
                }
                label={isDeleteMode ? "🏙️ Filter Daerah/Kota (Opsional)" : "🏙️ Daerah/Kota"}
                searchKey="nama_daerah"
                disabled={!selectedProvinsi}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Clear Filters Button */}
        {(selectedProvinsi || selectedDaerah || searchTerm) && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClearFilters}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="text-lg">🗑️</span>
              <span className="font-medium">Hapus Semua Filter</span>
            </button>
          </div>
        )}

        {/* Enhanced Filter Info */}
        {(selectedProvinsi || selectedDaerah || searchTerm) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-bold text-blue-800 mb-1">Filter Aktif:</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {searchTerm && (
                    <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-medium">
                      🔍 "{searchTerm}"
                    </span>
                  )}
                  {selectedProvinsi && (
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-medium">
                      🗺️ {provinces.find(p => p.id === parseInt(selectedProvinsi))?.nama_provinsi}
                    </span>
                  )}
                  {selectedDaerah && (
                    <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-medium">
                      🏙️ {regions.find(r => r.id === parseInt(selectedDaerah))?.nama_daerah}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchAndFilter;