import { generalRequest} from '../utilities';
import { url_post, port_post, entryPointPost} from './server';

const URL_POST = `http://${url_post}:${port_post}/${entryPointPost}`;

const resolvers_post = {
	Query: {
		allPosts: (_) =>
			generalRequest(`${URL_POST}`, 'GET'),
		postById: (_, {post_id}) =>
			generalRequest(`${URL_POST}/${post_id}`, 'GET'),
	},
	Mutation: {
		createPost: (_, { post }) =>
			generalRequest(`${URL_POST}`, 'POST', post),
		updatePost: (_, { id,  post}) =>
			generalRequest(`${URL_POST}/${id}`, 'PUT', post),
		deletePost: (_, { id }) =>
			generalRequest(`${URL_POST}/${id}`, 'DELETE')
	}
};

export default resolvers_post;