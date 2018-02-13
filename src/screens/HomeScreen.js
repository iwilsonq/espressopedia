import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Location, Permissions } from 'expo';

import YelpService from '../services/yelp';
import Map from '../components/Map';

export default class HomeScreen extends Component {
	state = {
		location: null,
		errorMessage: null
	};

	componentWillMount() {
		this.getLocationAsync();
	}

	componentDidMount = async () => {
		let businesses = await YelpService.getCoffeeShops();
		businesses.map(bus => console.log(bus.id));
	};

	getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied'
			});
		}

		let location = await Location.getCurrentPositionAsync({});
		this.setState({ location });
	};

	render() {
		const { location } = this.state;
		if (!location) {
			return (
				<View>
					<Text>Waiting...</Text>
				</View>
			);
		}
		let region = {
			latitude: location.latitude,
			longitude: location.longitude
		};

		return (
			<View>
				<Map region={region} />
			</View>
		);
	}
}

const styles = {};
