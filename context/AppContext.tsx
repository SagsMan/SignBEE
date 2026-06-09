import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "individual" | "interpreter" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Interpreter {
  id: string;
  name: string;
  languages: string[];
  type: "Virtual" | "In-person" | "Virtual/In-person";
  rating: number;
  rate: number;
  availability: string;
  avatar?: string;
  reviews: number;
  bio: string;
  location?: string;
}

export interface Booking {
  id: string;
  interpreterId: string;
  interpreterName: string;
  interpreterAvatar?: string;
  type: "In-person" | "Virtual";
  language: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  venue?: string;
  link?: string;
  purpose: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  notes?: string;
  rate: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  bookings: Booking[];
  interpreters: Interpreter[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  setHasOnboarded: (val: boolean) => void;
  addBooking: (booking: Omit<Booking, "id">) => void;
  cancelBooking: (id: string) => void;
  updateUser: (data: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const MOCK_INTERPRETERS: Interpreter[] = [
  {
    id: "1",
    name: "Mary Olayemi",
    languages: ["ASL", "NSL"],
    type: "Virtual/In-person",
    rating: 4.2,
    rate: 30,
    availability: "08:00am - 11am",
    reviews: 128,
    bio: "Certified sign language interpreter with 8 years of experience in medical, legal, and community settings.",
    location: "Lagos, Nigeria",
  },
  {
    id: "2",
    name: "Steven Aina",
    languages: ["BSL", "NSL"],
    type: "Virtual",
    rating: 4.2,
    rate: 50,
    availability: "08:00am - 11am",
    reviews: 94,
    bio: "Professional BSL and NSL interpreter specializing in corporate and educational environments.",
    location: "Abuja, Nigeria",
  },
  {
    id: "3",
    name: "Amaka Chukwu",
    languages: ["ASL", "PSL"],
    type: "In-person",
    rating: 4.8,
    rate: 45,
    availability: "09:00am - 5pm",
    reviews: 203,
    bio: "Expert interpreter for medical emergencies and urgent legal situations. Available on short notice.",
    location: "Port Harcourt, Nigeria",
  },
  {
    id: "4",
    name: "Chidi Nwosu",
    languages: ["NSL", "ASL"],
    type: "Virtual/In-person",
    rating: 4.6,
    rate: 35,
    availability: "07:00am - 9pm",
    reviews: 156,
    bio: "Community interpreter dedicated to making everyday life more accessible for the deaf community.",
    location: "Enugu, Nigeria",
  },
  {
    id: "5",
    name: "Fatima Al-Hassan",
    languages: ["ASL", "MSL"],
    type: "Virtual",
    rating: 4.9,
    rate: 60,
    availability: "10:00am - 6pm",
    reviews: 89,
    bio: "Award-winning interpreter with specialization in academic and conference settings.",
    location: "Kano, Nigeria",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasOnboarded, setHasOnboardedState] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const [storedUser, storedOnboarded, storedBookings] = await Promise.all([
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem("hasOnboarded"),
        AsyncStorage.getItem("bookings"),
      ]);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      if (storedOnboarded === "true") setHasOnboardedState(true);
      if (storedBookings) setBookings(JSON.parse(storedBookings));
    } catch {}
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    const mockUser: User = {
      id: Date.now().toString(),
      name: "Aliya",
      email,
      phone: "+234 813 000 0000",
      role: "individual",
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
    return true;
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    _password: string,
    role: UserRole,
  ): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.multiRemove(["user", "bookings"]);
    setBookings([]);
  };

  const setHasOnboarded = async (val: boolean) => {
    setHasOnboardedState(val);
    await AsyncStorage.setItem("hasOnboarded", val ? "true" : "false");
  };

  const addBooking = async (booking: Omit<Booking, "id">) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    await AsyncStorage.setItem("bookings", JSON.stringify(updated));
  };

  const cancelBooking = async (id: string) => {
    const updated = bookings.map(b =>
      b.id === id ? { ...b, status: "cancelled" as const } : b,
    );
    setBookings(updated);
    await AsyncStorage.setItem("bookings", JSON.stringify(updated));
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    await AsyncStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        hasOnboarded,
        bookings,
        interpreters: MOCK_INTERPRETERS,
        login,
        register,
        logout,
        setHasOnboarded,
        addBooking,
        cancelBooking,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
