import React from 'react';
import SearchAndFilter from './SearchAndFilter';
import TourismGrid from './TourismGrid';

const DeleteTourismView = ({
  searchTerm,
  onSearchChange,
  selectedProvinsi,
  onProvinsiChange,
  selectedDaerah,
  onDaerahChange,
  provinces,
  regions,
  filteredRegions,
  searchResults,
  showSearchResults,
  onSearchResultClick,
  onClearFilters,
  onBack,
  error,
  loading,
  tourismData,
  onDelete,
  allTourismData,
}) => {
  const getRegionName = (id_daerah) => {
    const region = regions.find((r) => r.id === id_daerah);
    return region ? region.nama_daerah : 'Unknown';
  };

  const getProvinceName = (id_provinsi) => {
    const province = provinces.find((p) => p.id === id_provinsi);
    return province ? province.nama_provinsi : 'Unknown';
  };

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
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Kembali ke Beranda
          </button>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          selectedProvinsi={selectedProvinsi}
          onProvinsiChange={onProvinsiChange}
          selectedDaerah={selectedDaerah}
          onDaerahChange={onDaerahChange}
          provinces={provinces}
          filteredRegions={filteredRegions}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          regions={regions}
          onClearFilters={onClearFilters}
          onSearchResultClick={onSearchResultClick}
          isDeleteMode={true}
        />

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
                <TourismGrid
                  tourismData={searchResults}
                  regions={regions}
                  provinces={provinces}
                  isDeleteMode={true}
                  onDelete={onDelete}
                  loading={loading}
                />
              </div>
            )}

            {/* Show Regional Results */}
            {selectedDaerah && !searchTerm && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  🗑️ Destinasi Wisata di {getRegionName(parseInt(selectedDaerah))} untuk Dihapus
                </h2>
                <div className="mb-4 text-center text-sm text-gray-600">
                  Menampilkan {tourismData.length} destinasi wisata di{' '}
                  {getRegionName(parseInt(selectedDaerah))}
                </div>
                {tourismData.length > 0 ? (
                  <TourismGrid
                    tourismData={tourismData}
                    regions={regions}
                    provinces={provinces}
                    isDeleteMode={true}
                    onDelete={onDelete}
                    loading={loading}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-white rounded-lg shadow-md p-8">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Belum Ada Destinasi
                      </h3>
                      <p className="text-gray-600">
                        Belum ada destinasi wisata yang terdaftar di daerah ini.
                      </p>
                    </div>
                  </div>
                )}
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
};

export default DeleteTourismView;