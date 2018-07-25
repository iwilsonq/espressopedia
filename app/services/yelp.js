import axios from 'axios';
import config from '../config';

const api = axios.create({
	baseURL: 'https://api.yelp.com/v3',
	headers: {
		Authorization: `Bearer ${config['YELP_KEY']}`
	}
});

export const getCoffeeShops = (userLocation, filter = {}) => {
	return api
		.get('/businesses/search', {
			params: {
				limit: 10,
				categories: 'coffee,coffeeroasteries,coffeeshops',
				...userLocation,
				...filter
			}
		})
		.then(res =>
			res.data.businesses.map(business => {
				return {
					name: business.name,
					coords: business.coordinates
				};
			})
		)
		.catch(error => console.error(error));
};

export default {
	getCoffeeShops
};
