import { generalRequest} from '../utilities';
import { url_location, port_location, entryPointLocation} from './server';

const URL_LOCATION = `http://${url_location}:${port_location}/${entryPointLocation}`;

const resolvers_location = {
	Query: {
		allLocations: (_) =>
			generalRequest(`${URL_LOCATION}`, 'GET'),
		locationById: (_, {location_id}) =>
			generalRequest(`${URL_LOCATION}/${location_id}`, 'GET'),
	},
	Mutation: {
		createLocation: (_, { location }) =>
			generalRequest(`${URL_LOCATION}`, 'POST', location),
		updateLocation: (_, { id,  location}) =>
			generalRequest(`${URL_LOCATION}/${id}`, 'PUT', location),
		deleteLocation: (_, { id }) =>
			generalRequest(`${URL_LOCATION}/${id}`, 'DELETE')
	}
};

export default resolvers_location;