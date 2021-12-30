import { gql } from '@apollo/client';

export const RegisterMutation = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;
