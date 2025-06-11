import React from "react";
import NavigationBar from "./NavigationBar";
import SearchAndFilter from "./SearchAndFilter";
import TourismGrid from "./TourismGrid";

const MainView = ({
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
  onAddTourism,
  onDeleteTourism,
  tourismData,
  filteredTourismData,
  loading,
  error,
}) => {
  const getRegionName = (id_daerah) => {
    const region = regions.find((r) => r.id === id_daerah);
    return region ? region.nama_daerah : "Unknown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-sans text-gray-800 p-6">
      <NavigationBar
        onAddTourism={onAddTourism}
        onDeleteTourism={onDeleteTourism}
      />

      <header className="max-w-5xl mx-auto text-center py-10">
        <h1 className="text-4xl font-bold mb-4">
          Jelajahi Tempat Wisata di Jawa Timur
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Cari destinasi wisata atau pilih provinsi dan daerah untuk melihat
          destinasi wisata menarik.
        </p>
      </header>

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
        isDeleteMode={false}
      />

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
            <TourismGrid
              tourismData={searchResults}
              regions={regions}
              provinces={provinces}
              isDeleteMode={false}
            />
          </div>
        )}

        {/* Show Regional Results */}
        {selectedDaerah && !searchTerm && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Destinasi Wisata di {getRegionName(parseInt(selectedDaerah))}
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
              <TourismGrid
                tourismData={tourismData}
                regions={regions}
                provinces={provinces}
                isDeleteMode={false}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Belum ada data tempat wisata di daerah ini.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Show Filtered Regional Results */}
        {selectedDaerah && searchTerm && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Destinasi di {getRegionName(parseInt(selectedDaerah))}
              <span className="text-lg text-gray-600">
                {" "}
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
                  Menampilkan {filteredTourismData.length} dari{" "}
                  {tourismData.length} destinasi di wilayah ini
                </div>
                <TourismGrid
                  tourismData={filteredTourismData}
                  regions={regions}
                  provinces={provinces}
                  isDeleteMode={false}
                />
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
      </main>

      <footer className="text-center text-sm text-gray-500 mt-16">
        &copy; {new Date().getFullYear()} Wisata Jawa Timur. Seluruh hak cipta
        dilindungi.
      </footer>
    </div>
  );
};

export default MainView;
