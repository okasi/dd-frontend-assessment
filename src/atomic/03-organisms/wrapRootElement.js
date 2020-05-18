import React from "react"
import { ApolloProvider } from "@apollo/client"
import { client } from "./initApollo"
import { ProvideAuth } from "./useAuth"

export const wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      <ProvideAuth>{element}</ProvideAuth>
    </ApolloProvider>
  )
}
