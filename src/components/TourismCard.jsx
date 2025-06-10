import React from 'react';
import { Star, Trash2 } from 'lucide-react';

const TourismCard = ({ 
  place, 
  regionName, 
  provinceName, 
  isDeleteMode = false, 
  onDelete,
  loading = false 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border hover:border-blue-300 transition">
      <h3 className="text-lg font-bold mb-1">{place.nama}</h3>
      <p className="text-sm text-gray-600 mb-2">{place.alamat}</p>
      {(regionName || provinceName) && (
        <p className="text-xs text-blue-600 mb-3">
          📍 {regionName || 'Unknown'}, {provinceName || 'Unknown'}
        </p>
      )}
      <div className="flex items-center text-yellow-500 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < Math.round(place.rating) ? '#facc15' : 'none'}
            strokeWidth={1.5}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">
          {place.rating} / 5
        </span>
      </div>
      
      {isDeleteMode ? (
        <button
          onClick={() => onDelete(place.id)}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
          disabled={loading}
        >
          <Trash2 size={16} />
          Hapus Destinasi
        </button>
      ) : (
        <a
          href={place.link_gmaps}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm hover:underline"
        >
          Lihat di Google Maps →
        </a>
      )}
    </div>
  );
};

export default TourismCard;