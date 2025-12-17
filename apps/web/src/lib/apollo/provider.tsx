"use client";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { createClient } from "@/lib/supabase/client";
import { ReactNode, useMemo } from "react";

function makeClient() {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/graphql",
  });

  const authLink = setContext(async (_, { headers }) => {
    // Get the authentication token from Supabase
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}

export function ApolloProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => makeClient(), []);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
