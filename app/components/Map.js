import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapView } from 'expo';
import get from 'lodash/get';

const deltas = {
	latitudeDelta: 0.0922,
	longitudeDelta: 0.0421
};

const initialRegion = {
	latitude: 37.321996988,
	longitude: -122.0325472123455
};

const Marker = MapView.Marker;

export default class Map extends Component {
	renderMarkers() {
		return this.props.places.map((place, i) => (
			<Marker key={i} title={place.name} coordinate={place.coords} />
		));
	}

	render() {
		const { location } = this.props;
		const region = {
			latitude: get(location, 'coords.latitude', null),
			longitude: get(location, 'coords.longitude', null),
			...deltas
		};

		if (!region.latitude || !region.longitude) {
			return (
				<View>
					<Text>Loading map...</Text>
				</View>
			);
		}

		return (
			<MapView
				style={styles.container}
				region={region}
				initialRegion={{ ...initialRegion, ...deltas }}
				showsUserLocation
				showsMyLocationButton
			>
				{this.renderMarkers()}
			</MapView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '80%'
	}
});
