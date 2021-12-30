import { gql } from '@apollo/client';

export const QueryUser = gql`
  query Users {
    users {
      email
    }
  }
`;
