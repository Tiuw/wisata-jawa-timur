import React from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';

const NavigationBar = ({ onAddTourism, onDeleteTourism }) => {
  return (
    <nav className="max-w-7xl mx-auto mb-12">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl px-10 py-6 border border-white/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Brand Logo */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-4 shadow-xl">
                <div className="text-white text-2xl">🏛️</div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Wisata Jawa Timur
                </h2>
                <p className="text-gray-600 font-medium">
                  Portal Destinasi Unggulan Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onAddTourism}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Plus
                size={22}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              <span className="font-semibold text-lg">Tambah Wisata</span>
            </button>

            <button
              onClick={onDeleteTourism}
              className="group bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Trash2
                size={22}
                className="group-hover:shake transition-transform duration-300"
              />
              <span className="font-semibold text-lg">Hapus Wisata</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
