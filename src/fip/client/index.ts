import fetch from "node-fetch";
import gql from "graphql-tag";

import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient, ApolloQueryResult } from "apollo-client";

const link = createPersistedQueryLink().concat(
  createHttpLink({
    uri: "https://www.fip.fr/latest/api/graphql",
    useGETForQueries: true,
    fetch
  })
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
});

export const stationDataQuery = gql`
  query Now($stationId: Int) {
    now(stationId: $stationId) {
      __typename
      playing_item {
        __typename
        title
        subtitle
        cover
        start_time
        end_time
      }
      song {
        __typename
        cover
        title
        interpreters
        label
        album
      }
    }
  }
`;

export function getStation(stationId: number): Promise<any> {
  const p_result = client.query({
    query: stationDataQuery,
    variables: {
      stationId: stationId
    }
  });

  return p_result.then(filterErrors);
}

function filterErrors(result: ApolloQueryResult<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    if (result.errors) {
      reject(new Error("Failure when fetching radio metadata"));
    }

    resolve(result.data);
  });
}
