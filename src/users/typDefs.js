export const userTypeDef = `
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

export const userQueries = `
    allUsers: UserDetails2!
    userById(user_id: Int!): UserDetails2!
`;

export const userMutations = `
    createUser(user: UserInput!): Boolean
    deleteUser(id: Int!): Boolean
	updateUser(id: Int!, user: UserInput2!): Boolean
	userLogin(input: LoginInput): UserDetails!
`;