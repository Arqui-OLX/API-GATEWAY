export const imagesTypeDef = `
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

export const imagesQueries = `
    allAdImagesByAdId(ad_id: String!): [AdImage]!
    userImageByUserId(user_id: String!): UserImage!
`;

export const imagesMutations = `
    createAdImage(adImage: AdImageInput!): AdImage!
    deleteAdImage(id: String!): Boolean
    updateAdImage(id: String!, path: String!): Boolean
    createUserImage(userImage: UserImageInput!): UserImage!
    deleteUserImage(id: String!): Boolean
    updateUserImage(id: String!, path: String!): Boolean
`;
