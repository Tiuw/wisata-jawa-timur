import React from 'react';
import TourismCard from './TourismCard';

const TourismGrid = ({ 
  tourismData, 
  regions, 
  provinces, 
  isDeleteMode = false, 
  onDelete,
  loading = false 
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tourismData.map((place) => {
        const region = regions.find((r) => r.id === place.id_daerah);
        const regionName = getRegionName(place.id_daerah);
        const provinceName = region ? getProvinceName(region.id_provinsi) : 'Unknown';

        return (
          <TourismCard
            key={place.id}
            place={place}
            regionName={regionName}
            provinceName={provinceName}
            isDeleteMode={isDeleteMode}
            onDelete={onDelete}
            loading={loading}
          />
        );
      })}
    </div>
  );
};

export default TourismGrid;