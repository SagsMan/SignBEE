# SignBee

<p align="center">
  <img src="./assets/images/icon.png" alt="SignBee official app logo" width="140" />
</p>

**Connect deaf individuals with certified sign language interpreters — instantly.**

SignBee is a frontend-only React Native mobile app built with Expo. It lets individuals book certified sign language interpreters for medical, legal, educational, religious, or everyday needs — virtually or in-person.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screens & Navigation](#screens--navigation)
- [Core Libraries](#core-libraries)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Open in Android Studio](#open-in-android-studio)
- [Build APK (Android)](#build-apk-android)
- [Build AAB for Google Play](#build-aab-for-google-play)
- [State Management](#state-management)
- [Design Tokens](#design-tokens)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) ~54 (SDK 54) |
| Language | TypeScript 5.9 (strict mode) |
| Navigation | [Expo Router](https://expo.github.io/router) v6 — file-based routing |
| State | React Context + AsyncStorage (no server) |
| Styling | React Native StyleSheet (inline design tokens) |
| Fonts | Inter (400 · 500 · 600 · 700) via `@expo-google-fonts/inter` |
| Icons | `@expo/vector-icons` (Feather set) + `expo-symbols` (SF Symbols on iOS) |
| Tabs | `expo-glass-effect` → NativeTabs (iOS 26 Liquid Glass) with Expo Tabs fallback |
| Gestures | `react-native-gesture-handler` |
| Keyboard | `react-native-keyboard-controller` (KeyboardAwareScrollView) |
| Haptics | `expo-haptics` |
| Blur | `expo-blur` (tab bar blur on iOS) |
| Storage | `@react-native-async-storage/async-storage` |
| Animation | `react-native-reanimated` |
| Package Mgr | npm (Node.js ≥ 20) |

---

## Project Structure

```
SignBEE/
├── app/                        # All screens (Expo Router file-based)
│   ├── _layout.tsx             # Root layout — fonts, providers, stack navigator
│   ├── index.tsx               # Splash / entry screen
│   ├── onboarding.tsx          # 3-slide onboarding carousel
│   ├── role.tsx                # Role selection (Individual / Interpreter)
│   ├── register.tsx            # Sign-up form
│   ├── login.tsx               # Log-in form
│   ├── booking.tsx             # Booking flow (In-person / Virtual)
│   ├── +not-found.tsx          # 404 fallback
│   ├── interpreter/
│   │   └── [id].tsx            # Dynamic interpreter profile + book CTA
│   └── (tabs)/
│       ├── _layout.tsx         # Tab bar (NativeTabs → ClassicTabs fallback)
│       ├── index.tsx           # Home — interpreter search & filter
│       ├── bookings.tsx        # My bookings (tabbed by status)
│       ├── messages.tsx        # Messages list
│       └── profile.tsx         # User profile + stats + settings
│
├── components/
│   ├── PrimaryButton.tsx       # Branded CTA button with haptics
│   ├── InputField.tsx          # Text input with label, error, password toggle
│   ├── InterpreterCard.tsx     # Interpreter list card (name, langs, rating, rate)
│   ├── BookingCard.tsx         # Booking summary card with status badge
│   ├── ErrorBoundary.tsx       # React class error boundary
│   └── ErrorFallback.tsx       # Error UI with dev-mode stack trace modal
│
├── context/
│   └── AppContext.tsx          # Global state: user, bookings, interpreters, auth
│
├── constants/
│   └── colors.ts               # Design tokens (brand palette)
│
├── hooks/
│   └── useColors.ts            # Returns active palette (light/dark aware)
│
├── assets/
│   └── images/                 # PNG assets (icons, rings, dots, characters)
│
├── app.json                    # Expo config (name, slug, splash, plugins)
├── babel.config.js             # babel-preset-expo
├── metro.config.js             # Metro bundler config
├── tsconfig.json               # TypeScript config (strict, baseUrl .)
└── package.json
```

---

## Screens & Navigation

```
index (Splash)
  └─▶ onboarding       (first launch only)
        └─▶ role       (select Individual / Interpreter)
              └─▶ register
                    └─▶ (tabs)
  └─▶ login            (returning user)
        └─▶ (tabs)
  └─▶ (tabs)           (already authenticated)

(tabs)
  ├── Home             — search & filter interpreters, tap to view profile
  ├── Bookings         — upcoming / ongoing / completed / cancelled
  ├── Messages         — conversation list
  └── Profile          — user info, booking stats, settings, logout

interpreter/[id]       — full profile, reviews, Book + Message CTAs
booking                — In-person or Virtual booking form
```

---

## Core Libraries

### Navigation
```
expo-router ~6.0.17
```
File-based routing powered by React Navigation. Every file in `app/` becomes a route automatically.

### Storage & State
```
@react-native-async-storage/async-storage 2.2.0
```
All user data (auth, role, bookings) is persisted locally via `AppContext`. No backend or API required.

### Keyboard Handling
```
react-native-keyboard-controller 1.18.5
```
`KeyboardAwareScrollView` wraps all forms so the keyboard never covers input fields.

### Fonts
```
@expo-google-fonts/inter ^0.4.0
```
Four weights loaded at startup: Regular (400), Medium (500), SemiBold (600), Bold (700).

### Tab Bar
```
expo-glass-effect ~0.1.4       # isLiquidGlassAvailable()
expo-blur ~15.0.8              # BlurView tab background on iOS
expo-symbols ~1.0.8            # SF Symbols on iOS
```
On iOS 26+ the tab bar uses native Liquid Glass. On older iOS / Android / Web it falls back to a standard Expo Tabs bar with blur.

### Safe Area
```
react-native-safe-area-context ~5.6.0
```
`useSafeAreaInsets()` used throughout for proper padding on notched devices.

---

## Installation

### Prerequisites

- **Node.js** ≥ 20 — [nodejs.org](https://nodejs.org)
- **npm** ≥ 10 (comes with Node.js — no extra install needed)
- **Expo Go** app on your phone — [iOS](https://apps.apple.com/app/expo-go/id982107779) · [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/SagsMan/SignBEE.git
cd SignBEE

# 2. Install all dependencies
npm install

# 3. Start the dev server
npm start
```

Scan the QR code that appears in your terminal with:
- **iOS** — your Camera app
- **Android** — the Expo Go app

---

## Running the App

| Command | What it does |
|---|---|
| `npm start` | Start Expo dev server (scan QR with phone) |
| `npm run android` | Open on Android emulator / connected device |
| `npm run ios` | Open on iOS simulator (macOS only) |
| `npm run web` | Open in the browser |
| `npm run typecheck` | Run TypeScript type checks |

---

## Open in Android Studio

Follow these steps to open SignBee as a native Android project inside Android Studio.

### Step 1 — Install prerequisites

- **Android Studio** (latest stable) — [developer.android.com/studio](https://developer.android.com/studio)
  During setup select: **Android SDK**, **Android SDK Platform**, **Android Virtual Device**
- **Java Development Kit (JDK) 17** — bundled inside Android Studio; no separate install needed
- **Node.js** ≥ 20 and **npm** ≥ 10

### Step 2 — Add the android folder (prebuild)

Expo manages the `android/` folder via prebuild. Run this once to generate it:

```bash
# Install dependencies first (if you haven't already)
npm install

# Generate the native android/ folder
npx expo prebuild --platform android
```

> This creates an `android/` folder at the root of the project. Do **not** edit it by hand — re-run `prebuild` after changing `app.json` or adding native plugins.

### Step 3 — Open in Android Studio

1. Launch **Android Studio**
2. Click **Open** (or **File → Open**)
3. Navigate to your cloned `SignBEE/` folder and select the `android/` subfolder
4. Click **OK** — Android Studio will sync Gradle (this takes 2–5 minutes the first time)

### Step 4 — Run on an emulator or device

**Emulator:**
1. In Android Studio click **Device Manager** (right sidebar)
2. Click **Create Device** → choose a phone (e.g. Pixel 8) → select API 35 system image → Finish
3. Press the green **Run ▶** button

**Physical device:**
1. On your Android phone go to **Settings → About Phone** → tap **Build Number** 7 times to enable Developer Mode
2. Enable **USB Debugging** in **Settings → Developer Options**
3. Connect via USB — your device appears in the device dropdown
4. Press the green **Run ▶** button

---

## Build APK (Android)

An APK is a single installable file you can share directly (sideload). Use this for testing or sharing with testers.

### Option A — EAS Build (recommended, cloud, no setup)

EAS (Expo Application Services) builds the APK in the cloud — no Android Studio or Java needed locally.

```bash
# Step 1 — Install EAS CLI globally
npm install -g eas-cli

# Step 2 — Log in to your Expo account (create one free at expo.dev)
eas login

# Step 3 — Configure EAS for this project (only once)
eas build:configure

# Step 4 — Build the APK
eas build -p android --profile preview
```

When the build finishes (≈ 5–10 min) EAS gives you a download link for the `.apk` file.

> The `preview` profile produces an APK. Add this to `eas.json` if it does not exist:
> ```json
> {
>   "build": {
>     "preview": {
>       "android": {
>         "buildType": "apk"
>       }
>     }
>   }
> }
> ```

### Option B — Local APK build (requires Android Studio)

```bash
# Step 1 — Generate the android/ folder (skip if already done)
npx expo prebuild --platform android

# Step 2 — Build a debug APK
cd android
./gradlew assembleDebug

# The APK is at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

Copy `app-debug.apk` to your phone and install it directly.

---

## Build AAB for Google Play

An **AAB** (Android App Bundle) is the format required by the Google Play Store. It is smaller than an APK because Play optimises delivery per device.

### Option A — EAS Build (recommended, cloud)

```bash
# Step 1 — Install EAS CLI (skip if already installed)
npm install -g eas-cli

# Step 2 — Log in
eas login

# Step 3 — Build the AAB for production
eas build -p android --profile production
```

EAS builds an `.aab` file and provides a download link (≈ 5–15 min). Upload it directly to the **Google Play Console → Production track**.

> The default `production` profile already produces an AAB. Your `eas.json` should look like:
> ```json
> {
>   "build": {
>     "production": {
>       "android": {
>         "buildType": "app-bundle"
>       }
>     },
>     "preview": {
>       "android": {
>         "buildType": "apk"
>       }
>     }
>   }
> }
> ```

### Option B — Local AAB build (requires Android Studio)

```bash
# Step 1 — Generate android/ folder (skip if already done)
npx expo prebuild --platform android

# Step 2 — Build a release AAB
cd android
./gradlew bundleRelease

# The AAB is at:
# android/app/build/outputs/bundle/release/app-release.aab
```

> **Note:** A release AAB must be signed with a keystore before uploading to the Play Store. In Android Studio go to **Build → Generate Signed Bundle / APK** and follow the wizard to create or use an existing keystore.

---

## State Management

Everything lives in `context/AppContext.tsx` — React Context + `useState` + AsyncStorage. No external state library, no backend.

```
AppContext provides:
  user              — logged-in user (name, email, phone, role)
  isAuthenticated   — boolean
  hasOnboarded      — boolean (persisted across launches)
  bookings          — Booking[]  (persisted)
  interpreters      — Interpreter[]  (5 mock entries, Nigerian context)

  login(email, password)          → sets user, marks authenticated
  register(name, email, ...)      → creates user, marks authenticated
  logout()                        → clears user + bookings from storage
  setHasOnboarded(true)           → persisted, skips onboarding next launch
  addBooking(booking)             → appends to bookings list, persisted
  cancelBooking(id)               → sets status → "cancelled", persisted
  updateUser(data)                → merges patch into user, persisted
```

---

## Design Tokens

Defined in `constants/colors.ts`, consumed via the `useColors()` hook:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#AAFF00` | Buttons, active states, splash background |
| `navyDark` | `#1A1340` | Headings, active tab, button text |
| `background` | `#FFFFFF` | Screen backgrounds |
| `muted` | `#F4F4F4` | Card backgrounds, input fills |
| `mutedForeground` | `#9B9BAA` | Placeholder text, secondary labels |
| `border` | `#EBEBEB` | Dividers, input borders |
| `greenLight` | `#E8FFB0` | Profile card, language chips, hero bg |
| `destructive` | `#FF4444` | Cancel actions, error messages |
| `star` | `#FFB800` | Rating stars |

---

## Brand

- **Primary colour:** `#AAFF00` (electric green)
- **Dark colour:** `#1A1340` (navy)
- **Font:** Inter (Google Fonts)
- **Target:** Nigerian sign language community (ASL, BSL, NSL, PSL, MSL)
