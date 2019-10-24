import { generalRequest} from '../utilities';
import { url, port, entryPointAds, entryPointUsers } from './server';

const URL_ADS_IMAGES = `http://${url}:${port}/${entryPointAds}`;
const URL_USER_IMAGES = `http://${url}:${port}/${entryPointUsers}`;

const resolvers_images = {
	Query: {
		allAdImagesByAdId: (_, {ad_id}) =>
			generalRequest(`${URL_ADS_IMAGES}/byid/${ad_id}`, 'GET'),
		userImageByUserId: (_, {user_id}) =>
			generalRequest(`${URL_USER_IMAGES}/byid/${user_id}`, 'GET'),
	},
	Mutation: {
		createAdImage: (_, { adImage }) =>
			generalRequest(`${URL_ADS_IMAGES}`, 'POST', adImage),
		updateAdImage: (_, { id, path }) =>
			generalRequest(`${URL_ADS_IMAGES}/${id}`, 'PATCH', path),
		deleteAdImage: (_, { id }) =>
			generalRequest(`${URL_ADS_IMAGES}/${id}`, 'DELETE'),
		createUserImage: (_, { userImage }) =>
			generalRequest(`${URL_USER_IMAGES}`, 'POST', userImage),
		updateUserImage: (_, { id, path }) =>
			generalRequest(`${URL_USER_IMAGES}/${id}`, 'PATCH', path),
		deleteUserImage: (_, { id }) =>
			generalRequest(`${URL_USER_IMAGES}/${id}`, 'DELETE')
	}
};

export default resolvers;
