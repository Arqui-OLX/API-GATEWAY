export const postTypeDef = `
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

export const postQueries = `
    allPosts: [Post]!
    postById(post_id: Int!): Post!
`;

export const postMutations = `
    createPost(post: PostInput!): Post!
    deletePost(id: Int!): Boolean
    updatePost(id: Int!, post: PostInput2!): Post!
`;
