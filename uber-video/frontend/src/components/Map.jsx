import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const Map = () => {
  return (
    <MapContainer
      center={[28.6139, 77.2090]}   // Delhi example
      zoom={13}
      minZoom={10}
      maxZoom={18}
      maxBounds={[
        [27.5, 76.5],   // South-West
        [29.5, 78.5]    // North-East
      ]}
      maxBoundsViscosity={1.0}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[28.6139, 77.2090]}>
        <Popup>
          You are here
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map
