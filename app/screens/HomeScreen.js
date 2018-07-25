import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';
import get from 'lodash/get';
import pick from 'lodash/pick';

import YelpService from '../services/yelp';
import Map from '../components/Map';

class HomeScreen extends Component {
	filterButtons = [
		{ label: 'Open now', color: '#9C27B0', filter: { openNow: true } },
		{ label: 'Starbucks', color: '#E91E63', filter: { term: 'starbucks' } },
		{
			label: 'Bubble Tea',
			color: '#8BC34A',
			filter: { term: 'bubble tea' }
		},
		{
			label: 'Walking Distance',
			color: '#00BCD4',
			filter: { radius: 3000 }
		},
		{
			label: 'Extra Hipster',
			color: '#F44336',
			filter: { attributes: 'hot_and_new' }
		}
	];

	state = {
		location: null,
		errorMessage: null,
		coffeeShops: []
	};

	componentWillMount() {
		this.getLocationAsync();
	}

	getCoffeeShops = async filter => {
		const coords = get(this.state.location, 'coords');
		const userLocation = pick(coords, ['latitude', 'longitude']);
		let coffeeShops = await YelpService.getCoffeeShops(
			userLocation,
			filter
		);
		this.setState({ coffeeShops });
	};

	getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied'
			});
		}

		let location = await Location.getCurrentPositionAsync({});
		await this.setState({ location });
		this.getCoffeeShops();
	};

	handleFilterPress = filter => {
		this.getCoffeeShops(filter);
	};

	renderFilterButtons() {
		return this.filterButtons.map((button, i) => (
			<Button
				key={i}
				title={button.label}
				buttonStyle={{
					backgroundColor: button.color,
					...styles.button
				}}
				onPress={() => this.handleFilterPress(button.filter)}
			/>
		));
	}

	render() {
		const { location, coffeeShops } = this.state;

		return (
			<View style={{ flex: 7 }}>
				<Map location={location} places={coffeeShops} />
				<View style={styles.filters}>{this.renderFilterButtons()}</View>
			</View>
		);
	}
}

const styles = {
	filters: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'wrap'
	},
	button: {
		marginVertical: 4
	}
};

export { HomeScreen };
