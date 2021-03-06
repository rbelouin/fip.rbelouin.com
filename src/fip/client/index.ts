import fetch from "cross-fetch";

import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient, ApolloQueryResult } from "apollo-client";
import { stationDataQuery } from "./query";

const link = createPersistedQueryLink().concat(
  createHttpLink({
    uri: "https://www.fip.fr/latest/api/graphql",
    useGETForQueries: true,
    fetch
  })
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
  defaultOptions: {
    query: {
      fetchPolicy: "network-only"
    }
  }
});

export function getStation(stationId: number): Promise<any> {
  const p_result = client.query({
    query: stationDataQuery,
    variables: {
      bannerPreset: "1400x1400",
      stationId: stationId,
      previousTrackLimit: 3
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
