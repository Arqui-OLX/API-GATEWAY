import { generalRequest} from '../utilities';
import { url_user, port_user, entryPointUser} from './server';

const URL_USER = `http://${url_user}:${port_user}/${entryPointUser}`;

const resolvers_user = {
	Query: {
		allUsers: (_) =>
			generalRequest(`${URL_USER}`, 'GET'),
		userById: (_, {user_id}) =>
			generalRequest(`${URL_USER}/${user_id}`, 'GET'),
	},
	Mutation: {
		createUser: (_, { user }) =>
			generalRequest(`${URL_USER}`, 'POST', user),
		updateUser: (_, { id,  user}) =>
			generalRequest(`${URL_USER}/${id}`, 'PUT', user),
		deleteUser: (_, { id }) =>
			generalRequest(`${URL_USER}/${id}`, 'DELETE'),
		userLogin: (_, { input }) =>
			generalRequest(`${URL_USER}/login`, 'POST', input)
	}
};

export default resolvers_user;