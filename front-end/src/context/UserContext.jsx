import { createContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";

import authUser from "@services/auth/authUser";

const UserContext = createContext({});

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function UserProvider ({ children }) {
  const queryClient = useQueryClient();

  const { data: user, refetch, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await authUser(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 2,
    onError: () => {
      queryClient.removeQueries(["user"]);
    }
  });

  const revalidateUser = useCallback(async () => {
    try {
      await refetch();

    } catch (error) {
      queryClient.removeQueries(["user"]);
    }
  }, [refetch, queryClient]);

  return (
    <UserContext.Provider value={{ user, revalidateUser, isLoading  }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
