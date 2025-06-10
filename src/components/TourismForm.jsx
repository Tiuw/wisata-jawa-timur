import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const TourismForm = ({
  onBack,
  onSubmit,
  initialData = null,
  isEdit = false,
  loading = false,
  error = null,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);

  const [formData, setFormData] = useState({
    id_provinsi: initialData?.id_provinsi || '',
    id_daerah: initialData?.id_daerah || '',
    nama: initialData?.nama || '',
    alamat: initialData?.alamat || '',
    rating: initialData?.rating || '',
    link_gmaps: initialData?.link_gmaps || '',
  });

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      const response = await fetch(`${BASE_URL}/provinsis`, {
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

  // Fetch regions
  const fetchRegions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/daerahs`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRegions(data);
      }
    } catch (err) {
      console.error('Error fetching regions:', err);
    }
  };

  // Filter regions based on selected province
  useEffect(() => {
    if (formData.id_provinsi) {
      const filtered = regions.filter(
        (region) => region.id_provinsi === parseInt(formData.id_provinsi)
      );
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions([]);
    }
  }, [formData.id_provinsi, regions]);

  // Load data on component mount
  useEffect(() => {
    fetchProvinces();
    fetchRegions();
  }, []);

  // Set filtered regions when editing existing data
  useEffect(() => {
    if (initialData && regions.length > 0) {
      const currentRegion = regions.find(
        (region) => region.id === initialData.id_daerah
      );
      if (currentRegion) {
        setFormData((prev) => ({
          ...prev,
          id_provinsi: currentRegion.id_provinsi.toString(),
        }));
      }
    }
  }, [initialData, regions]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset daerah when province changes
    if (name === 'id_provinsi') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        id_daerah: '', // Reset daerah selection
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'rating' ? parseFloat(value) || value : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for submission (remove id_provinsi as it's not needed for the API)
    const submitData = {
      id_daerah: parseInt(formData.id_daerah),
      nama: formData.nama,
      alamat: formData.alamat,
      rating: parseFloat(formData.rating),
      link_gmaps: formData.link_gmaps,
    };

    onSubmit(submitData);
  };

  const getSelectedProvinceName = () => {
    const province = provinces.find(
      (p) => p.id === parseInt(formData.id_provinsi)
    );
    return province ? province.nama_provinsi : '';
  };

  const getSelectedRegionName = () => {
    const region = regions.find((r) => r.id === parseInt(formData.id_daerah));
    return region ? region.nama_daerah : '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition flex items-center"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">
          {isEdit ? 'Edit Destinasi Wisata' : 'Tambah Destinasi Wisata Baru'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Province and Region Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Provinsi *
              </label>
              <select
                name="id_provinsi"
                value={formData.id_provinsi}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.nama_provinsi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Daerah/Kota *
              </label>
              <select
                name="id_daerah"
                value={formData.id_daerah}
                onChange={handleChange}
                required
                disabled={!formData.id_provinsi}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formData.id_provinsi
                    ? 'Pilih Daerah/Kota'
                    : 'Pilih Provinsi terlebih dahulu'}
                </option>
                {filteredRegions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.nama_daerah}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tourism Details */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nama Destinasi Wisata *
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan nama destinasi wisata (contoh: Pantai Klayar, Candi Borobudur)"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Alamat Lengkap *
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-vertical"
              placeholder="Masukkan alamat lengkap destinasi wisata..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rating (1.0 - 5.0) *
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                min="1"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="4.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan rating antara 1.0 hingga 5.0
              </p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Link Google Maps *
              </label>
              <input
                type="url"
                name="link_gmaps"
                value={formData.link_gmaps}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="https://maps.google.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Salin link dari Google Maps
              </p>
            </div>
          </div>

          {/* Preview Section */}
          {(formData.nama || formData.alamat) && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Preview
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600">
                      Provinsi:
                    </span>
                    <p className="text-gray-800">
                      {getSelectedProvinceName() || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Daerah:</span>
                    <p className="text-gray-800">
                      {getSelectedRegionName() || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Nama:</span>
                    <p className="text-gray-800">{formData.nama || '-'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Rating:</span>
                    <p className="text-gray-800">
                      {formData.rating ? `${formData.rating}/5` : '-'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-semibold text-gray-600">Alamat:</span>
                    <p className="text-gray-800">{formData.alamat || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading
                ? 'Menyimpan...'
                : isEdit
                ? 'Update Destinasi'
                : 'Tambah Destinasi'}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourismForm;
