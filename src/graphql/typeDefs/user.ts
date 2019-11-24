import { gql } from 'apollo-server-core';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
  }
  extend type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      dob: Date!
    ): Base!
    updateUser(
      id: ID!
      firstName: String
      lastName: String
      dob: Date
    ): Boolean!
    deleteUser(id: ID!): Boolean!
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    dob: Date!
    createdAt: Date!
    updatedAt: Date!
  }
  type Base {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
  }
`;
