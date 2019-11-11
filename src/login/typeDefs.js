export const loginTypeDef = `
input LoginInput {
    email: String!
    password: String!
}
input ExistsInput{
    email: String!
}
input createInput{
    email: String!
    password: String!
}
input modifyPasswordInput{
    email: String!
    newPassword: String!
}
`;

export const loginQueries = `
    exists(email: ExistsInput!): Boolean
`;

export const loginMutations = `
    login(credentials: LoginInput!): String
    create(credentials: createInput!): Boolean
    modifyPassword(data: modifyPasswordInput): Boolean
`;
