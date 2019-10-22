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

import imagesResolvers from './images/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		imagesTypeDef
	],
	[
		imagesQueries
	],
	[
		imagesMutations
	]
);
// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		imagesResolvers
	)
});
