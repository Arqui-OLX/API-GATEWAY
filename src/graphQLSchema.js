import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

//IMAGES MICROSERVICE
import {
	imagesMutations,
	imagesQueries,
	imagesTypeDef
} from './images/typeDefs';
import resolvers_images from './images/resolvers';


//IMAGES MICROSERVICE
import {
	postMutations,
	postQueries,
	postTypeDef,
} from './posts/typeDefs';
import resolvers_post from './posts/resolvers';

//LOCATION MICROSERVICE
import {
	locationMutations,
	locationQueries,
	locationTypeDef,
} from './location/typeDefs';
import resolvers_location from './location/resolvers';

//PROFILE MICROSERVICE
import {
	userMutations,
	userQueries,
	userTypeDef,
} from './users/typeDefs';
import resolvers_user from './users/resolvers';

//CATALOG MICROSERVICE
import {
	catalogMutations,
	catalogQueries,
	catalogTypeDef,
} from './catalog/typeDefs';
import resolvers_catalog from './catalog/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		imagesTypeDef,
		locationTypeDef,
		postTypeDef,
		catalogTypeDef,
		userTypeDef
	],
	[
		imagesQueries,
		locationQueries,
		postQueries,
		catalogQueries,
		userQueries
	],
	[
		imagesMutations,
		locationMutations,
		postMutations,
		catalogMutations,
		userMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers_images,
		resolvers_location,
		resolvers_post,
		resolvers_catalog,
		resolvers_user
	)
});
