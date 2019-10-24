import { generalRequest} from '../utilities';
import { url_catalog, port_catalog, entryPointCatalog} from './server';

const URL_CATALOG = `http://${url_catalog}:${port_catalog}`;


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

export default resolvers_catalog;