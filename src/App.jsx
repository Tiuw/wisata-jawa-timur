import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import "./App.css";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const apiWisataUrl = "http://127.0.0.1:8000/api/wisatas";
const apiDaerahUrl = "http://127.0.0.1:8000/api/daerahs";

const App = () => {
  const [cityName, setCityName] = useState("");
  const [tourismData, setTourismData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [error, setError] = useState(null);

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
    }
  };

  const handleCityNameChange = (event) => {
    setCityName(event.target.value);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRegions(); // Load region data on initial load
  }, []);

  // Fetch tourism data when city name (id_daerah) changes
  useEffect(() => {
    if (cityName) {
      // Find region ID based on city name entered
      const selectedRegion = regions.find(
        (region) => region.nama_daerah.toLowerCase() === cityName.toLowerCase()
      );
      if (selectedRegion) {
        fetchTourismData(selectedRegion.id); // Fetch tourism data based on id_daerah
      } else {
        setTourismData([]); // Clear data if city name doesn't match any region
      }
    } else {
      setTourismData([]); // Clear data if no city name is entered
    }
  }, [cityName, regions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-sans text-gray-800 p-6">
      <header className="max-w-5xl mx-auto text-center py-10">
        <h1 className="text-4xl font-bold mb-4">
          Jelajahi Tempat Wisata di Jawa Timur
        </h1>
        <p className="text-lg text-gray-600">
          Masukkan nama kota untuk melihat destinasi wisata menarik di Jawa
          Timur.
        </p>
      </header>

      <section className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-center">
          <input
            type="text"
            value={cityName}
            onChange={handleCityNameChange}
            className="px-5 py-2 rounded-full border text-sm font-medium w-80"
            placeholder="Masukkan Nama Kota (contoh: Bangkalan, Banyuwangi)"
          />
        </div>
      </section>

      <main className="max-w-4xl mx-auto">
        {cityName && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Destinasi Wisata di {cityName}
            </h2>
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            {tourismData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tourismData.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-2xl shadow-lg p-5 border hover:border-blue-300 transition"
                  >
                    <h3 className="text-lg font-bold mb-1">{place.nama}</h3>
                    <p className="text-sm text-gray-600 mb-3">{place.alamat}</p>
                    <div className="flex items-center text-yellow-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={
                            i < Math.round(place.rating) ? "#facc15" : "none"
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
                      className="text-blue-600 text-sm"
                    >
                      Lihat di Google Maps
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                Belum ada data tempat wisata yang ditemukan.
              </p>
            )}
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
