import gql from "graphql-tag";

// Make sure it matches the one fip.fr is using, as the server returns a 404 otherwise
export const stationDataQuery = gql`
  query Now($bannerPreset: String, $stationId: Int, $previousTrackLimit: Int!) {
    now(stationId: $stationId) {
      __typename
      playing_item {
        __typename
        title
        subtitle
        cover
        start_time
        end_time
        year
      }
      program {
        __typename
        uuid
        name
        animators
        visualConcept(preset: $bannerPreset) {
          url
          preview
          width
          height
          __typename
        }
      }
      song {
        __typename
        cover
        title
        interpreters
        musical_kind
        label
        album
        year
        external_links {
          youtube {
            id
            link
            image
          }
          deezer {
            id
            link
            image
          }
          itunes {
            id
            link
            image
          }
          spotify {
            id
            link
            image
          }
        }
      }
      server_time
      next_refresh
      mode
    }
    previousTracks: timelineCursor(
      first: $previousTrackLimit
      after: ""
      stationId: $stationId
    ) {
      __typename
      edges {
        __typename
        node {
          __typename
          title
          subtitle
          start_time
          cover
        }
      }
    }
    nextTracks: next(stationId: $stationId) {
      __typename
      title
      subtitle
      start_time
      cover
    }
  }
`;
