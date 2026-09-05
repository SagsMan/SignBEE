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
  isEmailVerified?: boolean;
  locationPermission?: "granted" | "denied" | "skipped";
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
  pendingVerificationEmail: string | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  setHasOnboarded: (val: boolean) => Promise<void>;
  addBooking: (booking: Omit<Booking, "id">) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  verifyEmail: (email: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  completePasswordReset: (email: string) => Promise<void>;
  joinWaitlist: (name: string, email: string) => Promise<void>;
  setLocationPermission: (
    status: "granted" | "denied" | "skipped",
  ) => Promise<void>;
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
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

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
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        if (parsedUser.isEmailVerified === false) {
          setPendingVerificationEmail(parsedUser.email);
        } else {
          setIsAuthenticated(true);
        }
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
      isEmailVerified: true,
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    setPendingVerificationEmail(null);
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
    await AsyncStorage.removeItem("pendingVerificationEmail");
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
      isEmailVerified: false,
    };
    setUser(newUser);
    setIsAuthenticated(false);
    setPendingVerificationEmail(email);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    await AsyncStorage.setItem("pendingVerificationEmail", email);
    return true;
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setPendingVerificationEmail(null);
    await AsyncStorage.multiRemove([
      "user",
      "bookings",
      "pendingVerificationEmail",
      "passwordResetEmail",
    ]);
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

  const verifyEmail = async (email: string): Promise<boolean> => {
    if (!user || user.email.toLowerCase() !== email.trim().toLowerCase()) {
      return false;
    }

    const verifiedUser = { ...user, isEmailVerified: true };
    setUser(verifiedUser);
    setIsAuthenticated(true);
    setPendingVerificationEmail(null);
    await AsyncStorage.setItem("user", JSON.stringify(verifiedUser));
    await AsyncStorage.removeItem("pendingVerificationEmail");
    return true;
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) return false;
    await AsyncStorage.setItem("passwordResetEmail", normalizedEmail);
    return true;
  };

  const completePasswordReset = async (email: string): Promise<void> => {
    await AsyncStorage.removeItem("passwordResetEmail");
    if (user?.email.toLowerCase() === email.trim().toLowerCase()) {
      await AsyncStorage.setItem("passwordResetCompleted", "true");
    }
  };

  const joinWaitlist = async (name: string, email: string): Promise<void> => {
    const existing = await AsyncStorage.getItem("waitlistEntries");
    const entries = existing ? JSON.parse(existing) : [];
    entries.push({
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem("waitlistEntries", JSON.stringify(entries));
  };

  const setLocationPermission = async (
    status: "granted" | "denied" | "skipped",
  ): Promise<void> => {
    if (!user) return;
    const updated = { ...user, locationPermission: status };
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
        pendingVerificationEmail,
        login,
        register,
        logout,
        setHasOnboarded,
        addBooking,
        cancelBooking,
        updateUser,
        verifyEmail,
        requestPasswordReset,
        completePasswordReset,
        joinWaitlist,
        setLocationPermission,
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
