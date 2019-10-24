'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}

	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */


/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */


/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const imagesTypeDef = `
type AdImage {
    _id: String!
    ad_id: String!
    ad_image: String!
}
input AdImageInput {
    ad_id: String!
    adImage: String!
}
type UserImage {
    _id: String!
    user_id: String!
    user_image: String!
}
input UserImageInput {
    user_id: String!
    userImage: String!
}`;

const imagesQueries = `
    allAdImagesByAdId(ad_id: String!): [AdImage]!
    userImageByUserId(user_id: String!): UserImage!
`;

const imagesMutations = `
    createAdImage(adImage: AdImageInput!): AdImage!
    deleteAdImage(id: String!): Boolean
    updateAdImage(id: String!, path: String!): Boolean
    createUserImage(userImage: UserImageInput!): UserImage!
    deleteUserImage(id: String!): Boolean
    updateUserImage(id: String!, path: String!): Boolean
`;

/*
export const url = process.env.IMAGES_URL
export const port = process.env.IMAGES_PORT
export const entryPointAds = process.env.ADS_IMAGES_ENTRY
export const entryPointUsers = process.env.USERS_IMAGES_ENTRY */
const url = '35.209.82.198';
const port = '3001';
const entryPointAds = 'ads-images';
const entryPointUsers = 'user-images';

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

const postTypeDef = `
type  Post{
    id: Int!
    title: String!
	description: String!
	date_publication: String!
	date_expiration: String!
	fk_product: Int!
}
input PostInput {
	title: String!
	description: String!
	date_publication: String!
	date_expiration: String!
	fk_product: Int!
}
input PostInput2 {
	title: String
	description: String
	date_publication: String
	date_expiration: String
	fk_product: Int
}
`;

const postQueries = `
    allPosts: [Post]!
    postById(post_id: Int!): Post!
`;

const postMutations = `
    createPost(post: PostInput!): Post!
    deletePost(id: Int!): Boolean
    updatePost(id: Int!, post: PostInput2!): Post!
`;

const url_post = '35.208.164.215';
const port_post = '3001';
const entryPointPost = 'posts';

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

const locationTypeDef = `
type Location {
    id: Int!
    address: String!
	city: String!
	latitude: Float!
	longitude: Float!
}
input LocationInput {
    address: String!
	city: String!
	latitude: Float!
	longitude: Float!
}
input LocationInput2 {
    address: String
	city: String
	latitude: Float
	longitude: Float
}`;

const locationQueries = `
    allLocations: [Location]!
    locationById(location_id: Int!): Location!
`;

const locationMutations = `
    createLocation(location: LocationInput!): Location!
    deleteLocation(id: Int!): Boolean
    updateLocation(id: Int!, location: LocationInput2!): Location!
`;

const url_location = '35.208.164.215';
const port_location = '3000';
const entryPointLocation = 'locations';

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

const userTypeDef = `
type  User{
    id: Int
    email: String
	nick: String
	location: String
	cellphone: String
	piclink: String
}
input  UserInput{
 	email: String!
	password: String!
	nick: String!
	location: String
	cellphone: String
	piclink: String
}
input  UserInput2{
 	email: String
	password: String
	nick: String
	location: String
	cellphone: String
	piclink: String
}
type  User2{
   email: String
   nick: String
   location: String
   cellphone: String
}
input LoginInput {
	email: String!
	password: String!
}
type UserDetails {
	error: Boolean!
	data: [User]
	message: String!
}
type UserDetails2{
	error: Boolean!
	data: [User2]
	message: String!
}
`;

const userQueries = `
    allUsers: UserDetails2!
    userById(user_id: Int!): UserDetails2!
`;

const userMutations = `
    createUser(user: UserInput!): Boolean
    deleteUser(id: Int!): Boolean
	updateUser(id: Int!, user: UserInput2!): Boolean
	userLogin(input: LoginInput): UserDetails!
`;

const url_user = '35.206.116.17';
const port_user = '3000';
const entryPointUser = 'users';

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

const catalogTypeDef = `
type Producto {
	catalog: Catalogo
	_id: String!
}

input ProductoInput {
	catalog: CatalogoInput
}

type Catalogo{

	_id: String
	vehiculos: Vehiculos
	telefonosTablets: TelefonosTablets
	computadores: Computadores
	electrodomesticos: Electrodomesticos
	empleos: Empleos
	servicios: Servicios
}
type Vehiculos{
	motos: Motos
	carros: Carros
}
type Carros{
	marca: String
	year: Int
	kilometraje: Int
	combustible: String
	color: String
	transmision: String
	placa: String
	precio: Precio
}
type Motos{
	marca: String
	anio: Int
	kilometraje: Int
	color: String
	cilindrada: String
	tipoVendedor: String
	precio: Precio
	placa: String
}
type TelefonosTablets{
	telefonos: Telefono
	tablets: Tablet
}
type Telefono{
	marca: String
	precio: Precio
}
type Tablet{
	marca: String
	precio: Precio
}
type Computadores{
	computadorEscritorio: ComputadorEscritorio
	portatiles: Portatiles
}
type ComputadorEscritorio{
	marca: String
	precio: Precio
} 
type Portatiles{
	marca: String
	precio: Precio
}
type Electrodomesticos{
	cocinas: Cocina
	neveras: Nevera
}
type Cocina{
	tipo: String
	precio: Precio
}
type Nevera{
	marca: String
	precio: Precio
}
type Precio{
	valorPrecio: Float
	tipoPago: String
}
type Empleos{
	buscarTrabajo: BuscarTrabajo
}
type  BuscarTrabajo{
	tipo: String
	enEsteAnuncio: String
	nombreCompania: String
	experienciaMin:Int
	experienciaMax:Int
	salarioMin:Int
	salarioMax:Int
}
type  Servicios{
	clasesCursos: ClasesCursos
	reparaciones: Reparaciones
	transporteMudanza: TransporteMudanza
}
type  ClasesCursos{
    tipo: String
}
type  Reparaciones{
    tipo: String
}
type  TransporteMudanza{
    tipo: String
}
input CatalogoInput{
	
	vehiculos: VehiculosInput
	telefonosTablets: TelefonosTabletsInput
	computadores: ComputadoresInput
	electrodomesticos: ElectrodomesticosInput
	empleos: EmpleosInput
	servicios: ServiciosInput
}
input VehiculosInput{
	motos: MotosInput
	carros: CarrosInput
}
input CarrosInput{
	marca: String
	year: Int
	kilometraje: Int
	combustible: String
	color: String
	transmision: String
	placa: String
	precio: PrecioInput!
}
input MotosInput{
	marca: String
	year: Int
	kilometraje: Int
	color: String
	cilindrada: String
	tipoVendedor: String
	precio: PrecioInput!
	placa: String
}
input TelefonosTabletsInput{
	telefonos: TelefonoInput
	tablets: TabletInput
}
input TelefonoInput{
	marca: String
	precio: PrecioInput!
}
input TabletInput{
	marca: String
	precio: PrecioInput!
}
input ComputadoresInput{
	computadorEscritorio: ComputadorEscritorioInput
	portatiles: PortatilesInput
}
input ComputadorEscritorioInput{
	marca: String
	precio: PrecioInput!
} 
input PortatilesInput{
	marca: String
	precio: PrecioInput!
}
input ElectrodomesticosInput{
	cocinas: CocinaInput
	neveras: NeveraInput
}
input CocinaInput{
	tipo: String
	precio: PrecioInput!
}
input NeveraInput{
	marca: String
	precio: PrecioInput!
}
input PrecioInput{
	valorPrecio: Float!
	tipoPago: String!
}
input EmpleosInput{
	buscarTrabajo: BuscarTrabajoInput
}
input  BuscarTrabajoInput{
	tipo: String
	enEsteAnuncio: String
	nombreCompania: String
	experienciaMin:Int
	experienciaMax:Int
	salarioMin:Int
	salarioMax:Int
}
input  ServiciosInput{
	clasesCursos: ClasesCursosInput
	reparaciones: ReparacionesInput
	transporteMudanza: TransporteMudanzaInput
}
input  ClasesCursosInput{
    tipo: String
}
input  ReparacionesInput{
    tipo: String
}
input  TransporteMudanzaInput{
    tipo: String
}
`;

const catalogQueries = `
	allCatalogs: [Producto]!
	catalogById(id: String!): Producto!
`;

const catalogMutations = `
    createCatalog(catalogo: ProductoInput!): Producto!
    deleteCatalog(id: String!): Boolean
    updateCatalog(id: String!, catalogo: ProductoInput!): Boolean
`;


const url_catalog = '35.209.82.198';
const port_catalog = '3002';
const entryPointCatalog = 'product';

const URL_CATALOG = `http://${url_catalog}:${port_catalog}/${entryPointCatalog}`;


const resolvers_catalog = {
	Query: {
		allCatalogs: (_) =>
			generalRequest(`${URL_CATALOG}`, 'GET'),
		catalogById: (_, {id}) =>
			generalRequest(`${URL_CATALOG}/${id}`, 'GET'),
	},
	Mutation: {
		createCatalog: (_, {catalogo}) =>
			generalRequest(`${URL_CATALOG}`, 'POST', catalogo),
		updateCatalog: (_, { id,  catalogo}) =>
			generalRequest(`${URL_CATALOG}/${id}`, 'PUT', catalogo),
		deleteCatalog: (_, { id }) =>
			generalRequest(`${URL_CATALOG}/${id}`, 'DELETE')
	}
};

//IMAGES MICROSERVICE
//IMAGES MICROSERVICE
//LOCATION MICROSERVICE
//PROFILE MICROSERVICE
//CATALOG MICROSERVICE
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
var graphQLSchema = graphqlTools.makeExecutableSchema({
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

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
