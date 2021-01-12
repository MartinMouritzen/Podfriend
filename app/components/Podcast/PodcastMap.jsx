import React from 'react';

import { FaMapMarkerAlt } from "react-icons/fa";

import GoogleMapReact from 'google-map-react';

const PodcastMap = ({ location }) => {
	var geoCoords = false;
	try {
		geoCoords = location.geo.split(',');
		geoCoords[0] = parseFloat(geoCoords[0].replace(/[^\d.-]/g, ''));
		geoCoords[1] = parseFloat(geoCoords[1].replace(/[^\d.-]/g, ''));
	}
	catch (exception) {
		console.log('Could not split geo coordinates');
		console.log(location);
		console.log(location.geo);
		console.log(exception);
	}

	const Marker = ({ text }) => {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
				<FaMapMarkerAlt size="34" fill="orange" style={{  }} />
				<div style={{ fontSize: '2vw'}}>
					{text}
				</div>
			</div>
		)
	};

	const center = {
		lat: geoCoords[0],
		lng: geoCoords[1]
	};
	const zoom = 11;

	return (
		<div style={{ minWidth: '85vw', height: '90vh', width: '100vw' }}>
			{ location.name &&
				<h1>{location.name}</h1>
			}
			<GoogleMapReact
				bootstrapURLKeys={{ key: 'AIzaSyBOcTd7Gk4oDJNrKVch2Amd-f8HgNYX4qg' }}
				defaultCenter={center}
				defaultZoom={zoom}
			>
				<Marker
					lat={center.lat}
					lng={center.lng}
					text={location.name}
				/>
			</GoogleMapReact>
		</div>
	);
};

export default PodcastMap;