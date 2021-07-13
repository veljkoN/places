import React, { useRef } from 'react'
import './Map.css'
const Map = props => {
    const mapRef = useRef()
    return (
        <div ref={mapRef} className={`map ${props.className}`} style={props.style}>
            Neka mapa
        </div>
    )
}

export default Map
