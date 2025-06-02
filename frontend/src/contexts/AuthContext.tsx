// Login and authentication logic

import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

// Define the User type in TypeScript
// This type represents the structure of a user object
export type User = {
  id: string;
  email: string;
  username: string;
};

// Define the UserContextInterface which includes the user state and a function to update it
// context is used to share the state across components
export interface UserContextInterface {
  user: User | null; // 'null' means not logged in
  setUser: Dispatch<SetStateAction<User | null>>; // Function to update the user
}

// This is the default state for the UserContext
// TypeScript needs to know the structure of the context
const defaultState = {
  user: null, // no user is logged in initially
  setUser: () => {}, // default empty function will be replaced in the provider
} as UserContextInterface;

// This is the actual context that will be used in the application using React's createContext
export const UserContext = createContext<UserContextInterface>(defaultState);

// Expected props for the provider, wraps other React components (children)
type UserProviderProps = {
  children: React.ReactNode;
};

// UserProvider component that will wrap the application
export default function UserProvider({ children }: UserProviderProps) {
  // useState hook to manage the user state
  // starts with 'null' meaning no user is logged in yet
  const [user, setUser] = useState<User | null>(null);

  // useEffect runs once when the app loads to check if a user is already logged in
  useEffect(() => {
    // Fetch the current user from the backend - return user data if logged in and null if not
    fetch("http://127.0.0.1:5000/auth/current-user", {
      method: "GET",
      credentials: "include", // ensures cookies/session are sent
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch current user");

        const data = await res.json();

        if (data.loggedIn) {
          const { email, username } = data.user;
          setUser({
            id: "", // ID is not provided in the response, can be set later if needed
            email,
            username,
          });
        } else {
          setUser(null); // No user logged in
        }
      })
      .catch((err) => {
        console.error("Error checking login status:", err);
        setUser(null); // On error, treat as logged out
      });
  }, []);

  // wraps children components with UserContext.Provider
  // so they can access the user state and setUser function
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
