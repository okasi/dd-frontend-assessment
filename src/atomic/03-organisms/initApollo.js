import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/link-context"
import fetch from "unfetch"
import * as localForage from "localforage"

const httpLink = createHttpLink({
  uri: `${process.env.BACKEND_GRAPH_URL}`,
  // credentials: "include",
  fetch,
})

const authLink = setContext(async (_, { headers }) => {
  const token = await localForage.getItem("token")
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// eslint-disable-next-line import/prefer-default-export
export const client = new ApolloClient({
  connectToDevTools: process.browser,
  ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
  link: authLink.concat(httpLink),
  fetchOptions: {
    mode: "no-cors",
  },
  cache: new InMemoryCache().restore({}),
})
