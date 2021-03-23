/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMkTable = /* GraphQL */ `
  query GetMkTable($dateTime: String!, $client: String!) {
    getMkTable(dateTime: $dateTime, client: $client) {
      client
      dateTime
    }
  }
`;
export const listMkTables = /* GraphQL */ `
  query ListMkTables(
    $filter: TableMkTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMkTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        client
        dateTime
      }
      nextToken
    }
  }
`;

export const listWeights = /* GraphQL */ `
  query listWeights {
    listWeightData {
      items { 
        Weight
        dateTime
      }
    }
  }
`;
