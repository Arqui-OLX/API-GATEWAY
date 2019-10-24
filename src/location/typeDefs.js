export const locationTypeDef = `
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

export const locationQueries = `
    allLocations: [Location]!
    locationById(location_id: Int!): Location!
`;

export const locationMutations = `
    createLocation(location: LocationInput!): Location!
    deleteLocation(id: Int!): Boolean
    updateLocation(id: Int!, location: LocationInput2!): Location!
`;