const React = require('react');
const { createContext, useContext } = React;
const { useAuth } = require('@/hooks/useAuth');

// Define the shape of the context
const AuthContext = createContext(undefined);

// Create the AuthProvider function
function AuthProvider({ children }) {
  const isAuthenticated = useAuth();
  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the authentication state
function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

module.exports = { AuthProvider, useAuthContext };
