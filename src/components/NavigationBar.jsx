import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const NavigationBar = ({ onAddTourism, onDeleteTourism }) => {
  return (
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
              onClick={onAddTourism}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Wisata
            </button>
            <button
              onClick={onDeleteTourism}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <Trash2 size={18} />
              Hapus Wisata
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;