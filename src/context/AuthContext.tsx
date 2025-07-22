import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/billing';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_DARK_MODE'; payload: boolean };

const initialState: AuthState = {
  user: {
    id: '1',
    username: 'admin',
    email: 'admin@ddas.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    avatar: undefined,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User,
  isAuthenticated: true,
  loading: false,
  error: null,
  theme: 'system',
  isDarkMode: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_DARK_MODE':
      return { ...state, isDarkMode: action.payload };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Update dark mode based on theme preference
  const updateDarkMode = (theme: 'light' | 'dark' | 'system') => {
    let isDark = false;
    
    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    dispatch({ type: 'SET_DARK_MODE', payload: isDark });
    
    // Update HTML class for Tailwind CSS
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
    updateDarkMode(savedTheme || 'system');
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (state.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (_: MediaQueryListEvent) => {
        updateDarkMode('system');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.theme]);

  const login = async (username: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (username === 'admin' && password === 'admin123') {
        const user: User = {
          id: '1',
          username: 'admin',
          email: 'admin@ddas.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          avatar: undefined,
          isActive: true,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme', theme);
    dispatch({ type: 'SET_THEME', payload: theme });
    updateDarkMode(theme);
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
