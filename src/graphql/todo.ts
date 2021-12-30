import { gql } from '@apollo/client';

export const TodoQuery = gql`
  query Todo {
    todos {
      id
      title
      description
    }
  }
`;

export const createMutation = gql`
  mutation Create($title: String!, $description: String!) {
    createTodo(title: $title, description: $description) {
      title
      description
    }
  }
`;

export const updateMutation = gql`
  mutation Update($id: Int!, $title: String!, $description: String!) {
    updateTodo(id: $id, title: $title, description: $description)
  }
`;

export const deleteMutation = gql`
  mutation Delete($id: Int!) {
    deleteTodo(id: $id)
  }
`;
