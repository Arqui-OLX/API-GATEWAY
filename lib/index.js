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
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}/${path}`, parameters);
	return generalRequest(queryUrl, 'GET');
}

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


//-------------------------------- IMAGES MICROSERVICE --------------------------------- //
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
    userImageByUserId(user_id: String!): [UserImage]!
`;

const imagesMutations = `
    deleteAdImage(id: String!): Boolean
	deleteUserImage(id: String!): Boolean
`;


const url_images = '35.209.82.198'
const port_images = '3001'
const entryPointAds = 'ads-images'
const entryPointUsers = 'user-images' 

const URL_ADS_IMAGES = `http://${url_images}:${port_images}/${entryPointAds}`;
const URL_USER_IMAGES = `http://${url_images}:${port_images}/${entryPointUsers}`;

const resolvers_images = {
	Query: {
		allAdImagesByAdId: (_, {ad_id}) =>
			generalRequest(`${URL_ADS_IMAGES}/byid/${ad_id}`, 'GET'),
		userImageByUserId: (_, {user_id}) =>
			generalRequest(`${URL_USER_IMAGES}/byid/${user_id}`, 'GET'),
	},
	Mutation: {
		deleteAdImage: (_, { id }) =>
			generalRequest(`${URL_ADS_IMAGES}/${id}`, 'DELETE'),
		deleteUserImage: (_, { id }) =>
			generalRequest(`${URL_USER_IMAGES}/${id}`, 'DELETE')
	}
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% IMAGES MICROSERVICE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

//-------------------------------- LOCATION MICROSERVICE --------------------------------- //
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

const url_location = '35.208.164.215'
const port_location = '3000'
const entryPointLocation = 'locations' 

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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% LOCATION MICROSERVICE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //


//-------------------------------- POST MICROSERVICE --------------------------------- //
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

const url_post = '35.208.164.215'
const port_post = '3001'
const entryPointPost = 'posts' 

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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% LOCATION MICROSERVICE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

//-------------------------------- CATALOG MICROSERVICE --------------------------------- //
const catalogTypeDef = `
type Catalogo{

	_id: String!
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
	marca: String!
	anio: Int!
	kilometraje: Int!
	combustible: String!
	color: String!
	transmision: String!
	placa: String!
	precio: Precio!
}
type Motos{
	marca: String!
	anio: Int!
	kilometraje: Int!
	color: String!
	cilindrada: String!
	tipoVendedor: String!
	precio: Precio!
}
type TelefonosTablets{
	telefonos: Telefono
	tablets: Tablet
}
type Telefono{
	marca: String!
	precio: Precio!
}
type Tablet{
	marca: String!
	precio: Precio!
}
type Computadores{
	computadorEscritorio: ComputadorEscritorio
	portatiles: Portatiles
}
type ComputadorEscritorio{
	precio: Precio!
} 
type Portatiles{
	marca: String!
	precio: Precio!
}
type Electrodomesticos{
	cocinas: Cocina
	neveras: Nevera
}
type Cocina{
	tipo: String!
	precio: Precio!
}
type Nevera{
	precio: Precio!
}
type Precio{
	valorPrecio: Float!
	tipoPago: String!
}
type Empleos{
	buscarTrabajo: BuscarTrabajo!
}
type  BuscarTrabajo{
	tipo: String!
	enEsteAnuncio: String!
	nombreCompania: String!
	experienciaMin:Int!
	experienciaMax:Int!
	salarioMin:Int!
	salarioMax:Int!
}
type  Servicios{
	clasesCursos: ClasesCursos
	reparaciones: Reparaciones
	transporteMudanza: TransporteMudanza
}
type  ClasesCursos{
    tipo: String!
}
type  Reparaciones{
    tipo: String!
}
type  TransporteMudanza{
    tipo: String!
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
	marca: String!
	anio: Int!
	kilometraje: Int!
	combustible: String!
	color: String!
	transmision: String!
	placa: String!
	precio: PrecioInput!
}
input MotosInput{
	marca: String!
	anio: Int!
	kilometraje: Int!
	color: String!
	cilindrada: String!
	tipoVendedor: String!
	precio: PrecioInput!
}
input TelefonosTabletsInput{
	telefonos: TelefonoInput
	tablets: TabletInput
}
input TelefonoInput{
	marca: String!
	precio: PrecioInput!
}
input TabletInput{
	marca: String!
	precio: PrecioInput!
}
input ComputadoresInput{
	computadorEscritorio: ComputadorEscritorioInput
	portatiles: PortatilesInput
}
input ComputadorEscritorioInput{
	precio: PrecioInput!
} 
input PortatilesInput{
	marca: String!
	precio: PrecioInput!
}
input ElectrodomesticosInput{
	cocinas: CocinaInput
	neveras: NeveraInput
}
input CocinaInput{
	tipo: String!
	precio: PrecioInput!
}
input NeveraInput{
	precio: PrecioInput!
}
input PrecioInput{
	valorPrecio: Float!
	tipoPago: String!
}
input EmpleosInput{
	buscarTrabajo: BuscarTrabajoInput!
}
input  BuscarTrabajoInput{
	tipo: String!
	enEsteAnuncio: String!
	nombreCompania: String!
	experienciaMin:Int!
	experienciaMax:Int!
	salarioMin:Int!
	salarioMax:Int!
}
input  ServiciosInput{
	clasesCursos: ClasesCursosInput
	reparaciones: ReparacionesInput
	transporteMudanza: TransporteMudanzaInput
}
input  ClasesCursosInput{
    tipo: String!
}
input  ReparacionesInput{
    tipo: String!
}
input  TransporteMudanzaInput{
    tipo: String!
}
`;

const catalogQueries = `
	allCatalogs: [Catalogo]!
`;

const catalogMutations = `
    createCatalog(catalogo: CatalogoInput): Catalogo!
    deleteCatalog(id: String!): Boolean
    updateCatalog(id: String!, catalogo: CatalogoInput!): Boolean
`;

const url_catalog = '35.209.82.198'
const port_catalog = '3002'
const entryPointCatalog = 'product' 

const URL_CATALOG = `http://${url_catalog}:${port_catalog}/`;


const resolvers_catalog = {
	Query: {
		allCatalogs: (_) =>
			generalRequest(`${URL_CATALOG}/${entryPointCatalog}`, 'GET'),
	},
	Mutation: {
		createCatalog: (_, {catalogo}) =>
			generalRequest(`${URL_CATALOG}/${entryPointCatalog}`, 'POST', catalogo),
		updateCatalog: (_, { id,  catalogo}) =>
			generalRequest(`${URL_CATALOG}/${id}`, 'PUT', catalogo),
		deleteCatalog: (_, { id }) =>
			generalRequest(`${URL_CATALOG}/${id}`, 'DELETE')
	}
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% CATALOG MICROSERVICE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //


// ----------------------------------- SCHEMA -----------------------------------------
// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		imagesTypeDef,
		locationTypeDef,
		postTypeDef,
		catalogTypeDef
	],
	[
		imagesQueries,
		locationQueries,
		postQueries,
		catalogQueries
	],
	[
		imagesMutations,
		locationMutations,
		postMutations,
		catalogMutations
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
		resolvers_catalog
	)
});


// %%%%%%%%%%%%%%%%%%%%%%%%% SCHEMA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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
