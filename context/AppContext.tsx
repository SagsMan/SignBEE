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
  isAvailable: boolean;
  experienceYears: number;
  bookingsCount: number;
  specialties: string[];
  certifications: string[];
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
  imageUri?: string;
  isRescheduled?: boolean;
  rescheduledAt?: string;
  cancellationReason?: string;
  rating?: number;
  review?: string;
  paymentStatus?: "pending" | "paid" | "failed";
  paymentReference?: string;
}

export type PaymentMethodType = "card" | "bank_transfer";
export type PaymentStatus = "idle" | "processing" | "success" | "failed";
export type TransactionType = "payment" | "top_up" | "withdrawal";
export type TransactionStatus = "pending" | "success" | "failed";

export interface SavedCard {
  id: string;
  brand: "Visa" | "Mastercard" | "Verve" | "Card";
  last4: string;
  expiry: string;
  holderName: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  reference: string;
  description: string;
  paymentMethod?: PaymentMethodType;
  bookingId?: string;
  destination?: string;
}

export interface PendingBooking extends Omit<Booking, "id"> {}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  bookings: Booking[];
  interpreters: Interpreter[];
  pendingVerificationEmail: string | null;
  favoriteInterpreterIds: string[];
  bookingDraft: PendingBooking | null;
  selectedPaymentMethod: PaymentMethodType | null;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  paymentReference: string | null;
  walletBalance: number;
  availableBalance: number;
  pendingBalance: number;
  savedCards: SavedCard[];
  transactions: Transaction[];
  paymentPinSet: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  setHasOnboarded: (val: boolean) => Promise<void>;
  addBooking: (booking: Omit<Booking, "id">) => Promise<string>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
  rescheduleBooking: (id: string, date: string, time: string) => Promise<void>;
  completeBooking: (id: string) => Promise<void>;
  rateBooking: (id: string, rating: number, review: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  verifyEmail: (email: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  completePasswordReset: (email: string) => Promise<void>;
  joinWaitlist: (name: string, email: string) => Promise<void>;
  setLocationPermission: (
    status: "granted" | "denied" | "skipped",
  ) => Promise<void>;
  toggleFavorite: (interpreterId: string) => Promise<void>;
  setBookingDraft: (booking: PendingBooking | null) => Promise<void>;
  setSelectedPaymentMethod: (method: PaymentMethodType | null) => Promise<void>;
  addSavedCard: (card: Omit<SavedCard, "id">) => Promise<SavedCard>;
  completeBookingPayment: (
    method: PaymentMethodType,
  ) => Promise<{ bookingId: string; transactionId: string }>;
  addWalletFunds: (
    amount: number,
    method: PaymentMethodType,
  ) => Promise<{ transactionId: string; reference: string }>;
  withdrawWalletFunds: (
    amount: number,
    destination: string,
  ) => Promise<{ transactionId: string; reference: string }>;
  setPaymentPin: (pin: string) => Promise<boolean>;
  validatePaymentPin: (pin: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | null>(null);

const MOCK_INTERPRETERS: Interpreter[] = [
  {
    id: "1",
    name: "Mary Olayemi",
    languages: ["ASL", "NSL"],
    type: "Virtual/In-person",
    rating: 4.2,
    rate: 20000,
    availability: "08:00am - 11am",
    isAvailable: true,
    experienceYears: 8,
    bookingsCount: 24,
    specialties: ["Medical", "Educational", "Business"],
    certifications: ["ASLIN Certified", "Medical Interpreting Certificate"],
    avatar: "female",
    reviews: 128,
    bio: "Certified sign language interpreter with 8+ years of experience in medical and educational settings. I’m passionate about providing clear communication and ensuring everyone feels understood and heard.",
    location: "Lagos, Nigeria",
  },
  {
    id: "2",
    name: "Steven Aina",
    languages: ["BSL", "NSL"],
    type: "Virtual",
    rating: 4.2,
    rate: 20000,
    availability: "08:00am - 11am",
    isAvailable: true,
    experienceYears: 6,
    bookingsCount: 18,
    specialties: ["Corporate", "Education", "Business"],
    certifications: ["NISL Certified"],
    avatar: "male",
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
    rate: 18000,
    availability: "09:00am - 5pm",
    isAvailable: true,
    experienceYears: 7,
    bookingsCount: 31,
    specialties: ["Medical", "Legal", "Emergency"],
    certifications: ["ASLIN Certified", "Medical Interpreting Certificate"],
    avatar: "female",
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
    rate: 15000,
    availability: "07:00am - 9pm",
    isAvailable: false,
    experienceYears: 5,
    bookingsCount: 16,
    specialties: ["Community", "Religious", "Everyday"],
    certifications: ["NISL Certified"],
    avatar: "male",
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
    rate: 25000,
    availability: "10:00am - 6pm",
    isAvailable: true,
    experienceYears: 10,
    bookingsCount: 42,
    specialties: ["Academic", "Conference", "Business"],
    certifications: ["ASLIN Certified", "Conference Interpreting Certificate"],
    avatar: "female",
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
  const [favoriteInterpreterIds, setFavoriteInterpreterIds] = useState<string[]>([]);
  const [bookingDraft, setBookingDraftState] = useState<PendingBooking | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethodState] =
    useState<PaymentMethodType | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentPinSet, setPaymentPinSetState] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const [
        storedUser,
        storedOnboarded,
        storedBookings,
        storedFavorites,
        storedBookingDraft,
        storedSelectedPaymentMethod,
        storedWalletBalance,
        storedAvailableBalance,
        storedPendingBalance,
        storedSavedCards,
        storedTransactions,
        storedPaymentPinHash,
      ] = await Promise.all([
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem("hasOnboarded"),
        AsyncStorage.getItem("bookings"),
        AsyncStorage.getItem("favoriteInterpreterIds"),
        AsyncStorage.getItem("bookingDraft"),
        AsyncStorage.getItem("selectedPaymentMethod"),
        AsyncStorage.getItem("walletBalance"),
        AsyncStorage.getItem("availableBalance"),
        AsyncStorage.getItem("pendingBalance"),
        AsyncStorage.getItem("savedCards"),
        AsyncStorage.getItem("transactions"),
        AsyncStorage.getItem("paymentPinHash"),
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
      if (storedFavorites) setFavoriteInterpreterIds(JSON.parse(storedFavorites));
      if (storedBookingDraft) setBookingDraftState(JSON.parse(storedBookingDraft));
      if (storedSelectedPaymentMethod) {
        setSelectedPaymentMethodState(storedSelectedPaymentMethod as PaymentMethodType);
      }
      if (storedWalletBalance) {
        const balance = Number(storedWalletBalance) || 0;
        setWalletBalance(balance);
      }
      if (storedAvailableBalance) {
        setAvailableBalance(Number(storedAvailableBalance) || 0);
      } else if (storedWalletBalance) {
        setAvailableBalance(Number(storedWalletBalance) || 0);
      }
      if (storedPendingBalance) setPendingBalance(Number(storedPendingBalance) || 0);
      if (storedSavedCards) setSavedCards(JSON.parse(storedSavedCards));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedPaymentPinHash) setPaymentPinSetState(true);
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
      "favoriteInterpreterIds",
      "bookingDraft",
      "selectedPaymentMethod",
      "walletBalance",
      "availableBalance",
      "pendingBalance",
      "savedCards",
      "transactions",
      "paymentPinHash",
    ]);
    setBookings([]);
    setFavoriteInterpreterIds([]);
    setBookingDraftState(null);
    setSelectedPaymentMethodState(null);
    setPaymentStatus("idle");
    setPaymentAmount(0);
    setPaymentReference(null);
    setWalletBalance(0);
    setAvailableBalance(0);
    setPendingBalance(0);
    setSavedCards([]);
    setTransactions([]);
    setPaymentPinSetState(false);
  };

  const setHasOnboarded = async (val: boolean) => {
    setHasOnboardedState(val);
    await AsyncStorage.setItem("hasOnboarded", val ? "true" : "false");
  };

  const addBooking = async (booking: Omit<Booking, "id">): Promise<string> => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    await AsyncStorage.setItem("bookings", JSON.stringify(updated));
    return newBooking.id;
  };

  const updateBooking = async (id: string, data: Partial<Booking>) => {
    const updated = bookings.map(b =>
      b.id === id ? { ...b, ...data } : b,
    );
    setBookings(updated);
    await AsyncStorage.setItem("bookings", JSON.stringify(updated));
  };

  const cancelBooking = async (id: string, reason?: string) => {
    await updateBooking(id, {
      status: "cancelled",
      cancellationReason: reason,
    });
  };

  const rescheduleBooking = async (
    id: string,
    date: string,
    time: string,
  ): Promise<void> => {
    await updateBooking(id, {
      date,
      time,
      status: "upcoming",
      isRescheduled: true,
      rescheduledAt: new Date().toISOString(),
    });
  };

  const completeBooking = async (id: string): Promise<void> => {
    await updateBooking(id, { status: "completed" });
  };

  const rateBooking = async (
    id: string,
    rating: number,
    review: string,
  ): Promise<void> => {
    await updateBooking(id, { status: "completed", rating, review });
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

  const toggleFavorite = async (interpreterId: string): Promise<void> => {
    const updated = favoriteInterpreterIds.includes(interpreterId)
      ? favoriteInterpreterIds.filter(id => id !== interpreterId)
      : [...favoriteInterpreterIds, interpreterId];
    setFavoriteInterpreterIds(updated);
    await AsyncStorage.setItem(
      "favoriteInterpreterIds",
      JSON.stringify(updated),
    );
  };

  const setBookingDraft = async (booking: PendingBooking | null) => {
    setBookingDraftState(booking);
    if (booking) {
      await AsyncStorage.setItem("bookingDraft", JSON.stringify(booking));
    } else {
      await AsyncStorage.removeItem("bookingDraft");
    }
  };

  const setSelectedPaymentMethod = async (method: PaymentMethodType | null) => {
    setSelectedPaymentMethodState(method);
    if (method) {
      await AsyncStorage.setItem("selectedPaymentMethod", method);
    } else {
      await AsyncStorage.removeItem("selectedPaymentMethod");
    }
  };

  const addSavedCard = async (card: Omit<SavedCard, "id">): Promise<SavedCard> => {
    const savedCard: SavedCard = {
      ...card,
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    const updated = [savedCard, ...savedCards];
    setSavedCards(updated);
    await AsyncStorage.setItem("savedCards", JSON.stringify(updated));
    return savedCard;
  };

  const createReference = (prefix: string) =>
    `SBE-${prefix}-${Date.now().toString().slice(-8)}`;

  const persistWallet = async (
    balance: number,
    available: number,
    pending: number,
    nextTransactions: Transaction[],
  ) => {
    setWalletBalance(balance);
    setAvailableBalance(available);
    setPendingBalance(pending);
    setTransactions(nextTransactions);
    await AsyncStorage.multiSet([
      ["walletBalance", String(balance)],
      ["availableBalance", String(available)],
      ["pendingBalance", String(pending)],
      ["transactions", JSON.stringify(nextTransactions)],
    ]);
  };

  const completeBookingPayment = async (
    method: PaymentMethodType,
  ): Promise<{ bookingId: string; transactionId: string }> => {
    if (!bookingDraft) throw new Error("No booking is ready for payment.");
    setPaymentStatus("processing");
    setPaymentAmount(bookingDraft.rate);
    setPaymentReference(null);
    await new Promise(resolve => setTimeout(resolve, 650));

    const reference = createReference("PAY");
    const bookingId = await addBooking({
      ...bookingDraft,
      paymentStatus: "paid",
      paymentReference: reference,
    });
    const transactionId = `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const transaction: Transaction = {
      id: transactionId,
      type: "payment",
      amount: bookingDraft.rate,
      status: "success",
      date: new Date().toISOString(),
      reference,
      description: `Interpreter booking with ${bookingDraft.interpreterName}`,
      paymentMethod: method,
      bookingId,
    };
    const nextTransactions = [transaction, ...transactions];
    await persistWallet(walletBalance, availableBalance, pendingBalance, nextTransactions);
    await setBookingDraft(null);
    await setSelectedPaymentMethod(method);
    setPaymentReference(reference);
    setPaymentStatus("success");
    return { bookingId, transactionId };
  };

  const addWalletFunds = async (
    amount: number,
    method: PaymentMethodType,
  ): Promise<{ transactionId: string; reference: string }> => {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Enter a valid amount.");
    }
    setPaymentStatus("processing");
    setPaymentAmount(amount);
    await new Promise(resolve => setTimeout(resolve, 650));

    const reference = createReference("TOP");
    const transactionId = `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const transaction: Transaction = {
      id: transactionId,
      type: "top_up",
      amount,
      status: "success",
      date: new Date().toISOString(),
      reference,
      description: "Wallet top-up",
      paymentMethod: method,
    };
    await persistWallet(
      walletBalance + amount,
      availableBalance + amount,
      pendingBalance,
      [transaction, ...transactions],
    );
    await setSelectedPaymentMethod(method);
    setPaymentReference(reference);
    setPaymentStatus("success");
    return { transactionId, reference };
  };

  const withdrawWalletFunds = async (
    amount: number,
    destination: string,
  ): Promise<{ transactionId: string; reference: string }> => {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Enter a valid amount.");
    }
    if (amount > availableBalance) {
      throw new Error("That amount is greater than your available balance.");
    }
    if (!destination.trim()) {
      throw new Error("Add a withdrawal destination.");
    }
    setPaymentStatus("processing");
    setPaymentAmount(amount);
    await new Promise(resolve => setTimeout(resolve, 650));

    const reference = createReference("WD");
    const transactionId = `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const transaction: Transaction = {
      id: transactionId,
      type: "withdrawal",
      amount,
      status: "success",
      date: new Date().toISOString(),
      reference,
      description: "Wallet withdrawal",
      destination: destination.trim(),
    };
    await persistWallet(
      walletBalance - amount,
      availableBalance - amount,
      pendingBalance,
      [transaction, ...transactions],
    );
    setPaymentReference(reference);
    setPaymentStatus("success");
    return { transactionId, reference };
  };

  const hashPin = (pin: string) =>
    pin.split("").reduce((hash, char) => ((hash * 31 + char.charCodeAt(0)) >>> 0), 7).toString(16);

  const setPaymentPin = async (pin: string): Promise<boolean> => {
    if (!/^\d{4}$/.test(pin)) return false;
    await AsyncStorage.setItem("paymentPinHash", hashPin(pin));
    setPaymentPinSetState(true);
    return true;
  };

  const validatePaymentPin = async (pin: string): Promise<boolean> => {
    if (!/^\d{4}$/.test(pin)) return false;
    const stored = await AsyncStorage.getItem("paymentPinHash");
    return Boolean(stored && stored === hashPin(pin));
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
        favoriteInterpreterIds,
        bookingDraft,
        selectedPaymentMethod,
        paymentStatus,
        paymentAmount,
        paymentReference,
        walletBalance,
        availableBalance,
        pendingBalance,
        savedCards,
        transactions,
        paymentPinSet,
        login,
        register,
        logout,
        setHasOnboarded,
        addBooking,
        cancelBooking,
        rescheduleBooking,
        completeBooking,
        rateBooking,
        updateUser,
        verifyEmail,
        requestPasswordReset,
        completePasswordReset,
        joinWaitlist,
        setLocationPermission,
        toggleFavorite,
        setBookingDraft,
        setSelectedPaymentMethod,
        addSavedCard,
        completeBookingPayment,
        addWalletFunds,
        withdrawWalletFunds,
        setPaymentPin,
        validatePaymentPin,
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
