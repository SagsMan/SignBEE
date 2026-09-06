# SignBee

<p align="center">
  <img src="./assets/images/icon.png" alt="SignBee official app logo" width="140" />
</p>

**Connect deaf individuals with certified sign-language interpreters — for the moments that matter.**

SignBee is an Expo mobile app for finding, booking, and communicating with sign-language interpreters in Nigeria. It supports virtual and in-person interpretation for medical, legal, education, business, religious, and everyday needs. The current release is a complete local-state product prototype: the primary user and interpreter journeys are wired end to end, while production services are documented below instead of being simulated as available infrastructure.

> **Release-readiness note:** SignBee currently uses React Context and AsyncStorage rather than a hosted backend. Payments, authentication, support delivery, real-time messaging, calls, push notifications, and credential verification are local demonstrations until their production services are connected.

## Contents

- [Product scope](#product-scope)
- [Current release status](#current-release-status)
- [Technology](#technology)
- [Repository map](#repository-map)
- [Navigation and screen inventory](#navigation-and-screen-inventory)
- [Client experience](#client-experience)
- [Interpreter experience](#interpreter-experience)
- [Shared state and persistence](#shared-state-and-persistence)
- [Payments and wallet](#payments-and-wallet)
- [Design and Figma](#design-and-figma)
- [Setup](#setup)
- [Development commands](#development-commands)
- [Expo and release configuration](#expo-and-release-configuration)
- [Backend dependencies](#backend-dependencies)
- [QA checklist](#qa-checklist)
- [Known limitations](#known-limitations)

## Product scope

### For clients

- First-launch onboarding and role selection
- Individual registration, login, email-verification demo, and password-reset demo
- Interpreter search by name, location, or language
- Filters for all, virtual, in-person, and available-now interpreters
- SignBee Agent request flow for urgent interpreter matching
- Interpreter profiles with availability, specialties, certifications, reviews, favorites, and booking
- Two-step booking for virtual or in-person appointments
- Date, time, duration, language, purpose, notes, and optional image attachment
- Card and bank-transfer payment flows
- Booking status, appointment details, rescheduling, cancellation, completion, and rating
- Conversation list, text/image messages, and local audio/video-call entry points
- Wallet, transactions, top-up, withdrawal, payment PIN, addresses, referrals, rewards, notifications, FAQ, and support

### For interpreters

- Interpreter dashboard and role-aware tab navigation
- Availability status and schedule
- Pending, upcoming, completed, and cancelled jobs
- Job details, accept, decline, and complete actions
- Interpreter profile, experience, languages, credentials, availability, and preferences
- Earnings summary with pending and available earnings
- Shared messages, notifications, profile, account, and logout flows

## Current release status

### Verified in the local app

- Expo Router route tree is present for all client and interpreter screens.
- TypeScript strict typechecking passes after dependencies are installed.
- Client booking creation creates a pending job that appears in the interpreter job list.
- Interpreter accept, decline, and complete actions update the shared booking record.
- Virtual and in-person selection is carried from interpreter discovery into the booking form.
- Interpreter profile messaging opens a real local conversation instead of a dead-end alert.
- SignBee Agent request, triage, matching, monitoring, and message flows are available from the client home screen.
- AsyncStorage persistence covers the local prototype state.
- Logout clears user-specific state, including interpreter profile and earnings, to prevent device-level leakage into the next session.
- Expo web preview starts successfully in this development environment.

### Not production-ready yet

- Login and registration are local demo flows; no authentication provider or password validation is connected.
- Payment screens record local success; no card processor, bank transfer provider, or server-side ledger is connected.
- Messages and calls are local UI flows; there is no real-time transport or media provider.
- Support requests are saved on the device and are not delivered to a support team.
- Interpreter credentials are stored locally and cannot be reviewed by an administrator.
- AsyncStorage is not encrypted and should not be used for production payment credentials, PINs, or sensitive personal data.

## Technology

| Area | Choice |
| --- | --- |
| Mobile framework | Expo SDK 54 |
| Navigation | Expo Router 4, file-based routing |
| Language | TypeScript with strict checking |
| UI | React Native StyleSheet |
| State | React Context and React hooks |
| Persistence | `@react-native-async-storage/async-storage` |
| Fonts | Inter 400, 500, 600, and 700 |
| Icons | Feather icons and SF Symbols on iOS |
| Images | Expo Image Picker |
| Location | Expo Location |
| Keyboard handling | `react-native-keyboard-controller` |
| Motion and feedback | React Native Animated and Expo Haptics |
| Web preview | Expo web / Metro |
| Package manager | npm |

The app intentionally remains on the existing Expo dependency set from the repository. Do not upgrade major Expo, React Native, or Router versions as part of Phase 8 without a separate migration plan.

## Repository map

```text
SignBEE/
├── app/                         Expo Router screens and dynamic routes
│   ├── (tabs)/                  Client/interpreter tab shell
│   ├── interpreter/             Interpreter-specific routes
│   ├── appointment/[id].tsx     Appointment details
│   ├── booking.tsx              Two-step booking form
│   ├── conversation/[id].tsx    Local messaging thread
│   ├── interpreter/[id].tsx     Client-facing interpreter profile
│   └── ...                      Auth, payments, wallet, support, settings
├── components/                  Shared client and interpreter UI
├── context/AppContext.tsx       Source of truth for local app state
├── constants/colors.ts          SignBee color tokens
├── hooks/useColors.ts           Active color palette hook
├── assets/images/               App icon, avatars, and UI imagery
├── scripts/build.js             Static Expo Go bundle preparation
├── server/serve.js              Static build server
├── app.json                     Expo application configuration
├── eas.json                     EAS build profiles
├── package.json                 npm scripts and dependencies
└── tsconfig.json                Strict TypeScript configuration
```

## Navigation and screen inventory

Expo Router derives routes from the `app/` directory. The root stack registers the complete route surface in `app/_layout.tsx`.

### Entry and authentication

- `/` — animated splash and session redirect
- `/onboarding` — first-launch onboarding
- `/role` — Individual or Interpreter role selection
- `/register` — registration
- `/login` — login
- `/verify-account` — local verification-code demo
- `/email-verification` — verification guidance
- `/forgot-password` — password reset request
- `/reset-password` — local password reset demo
- `/password-changed` — reset confirmation
- `/location-permission` — location permission choice
- `/waitlist` — waitlist form

### Client booking and discovery

- `/(tabs)` — client or interpreter tab shell
- `/(tabs)/index` — client home or interpreter dashboard
- `/interpreters` — searchable interpreter list and filters
- `/interpreter/[id]` — interpreter profile, favorites, messaging, booking
- `/agent` — SignBee Agent request form
- `/agent/matching` — local triage and matching state
- `/agent/confirmed` — matched interpreter, monitoring, and message action
- `/booking` — booking details and review
- `/booking-confirmation` — booking confirmation
- `/appointment/[id]` — appointment details
- `/reschedule/[id]` — reschedule flow
- `/cancel-booking/[id]` — cancellation flow
- `/rating/[id]` — completed booking rating

### Payments and wallet

- `/payment-method` — choose card or bank transfer
- `/card-payment` — card entry demo
- `/card-added` — saved-card confirmation
- `/bank-transfer` — bank transfer instructions/demo
- `/payment-success` — payment confirmation
- `/wallet` — wallet overview
- `/add-funds` — top-up method selection
- `/top-up` — top-up flow
- `/withdraw` — withdrawal flow
- `/payment-pin` — local four-digit payment PIN
- `/transactions` — transaction list
- `/transaction/[id]` — transaction details

### Communication and account

- `/(tabs)/messages` — conversations
- `/conversation/[id]` — messages, image attachments, call entry points
- `/notification-center` — notifications
- `/(tabs)/profile` — profile and account hub
- `/account-information` — account details
- `/edit-profile` — client profile editing
- `/password-security` — password settings demo
- `/addresses` and `/add-address` — saved locations
- `/support`, `/contact-support`, `/faq` — support surfaces
- `/referrals` and `/rewards` — referral and reward surfaces
- `/terms` and `/privacy` — legal information
- `/incoming-call` and `/call/[id]` — local call UI

### Interpreter

- `/interpreter` — interpreter dashboard entry
- `/interpreter/jobs` — job list and filters
- `/interpreter/job/[id]` — accept, decline, and complete job actions
- `/interpreter/profile` — interpreter profile hub
- `/interpreter/edit-profile` — name and bio
- `/interpreter/credentials` — credentials list and submission
- `/interpreter/languages` — sign languages and proficiency
- `/interpreter/experience` — experience and specialties
- `/interpreter/availability` — availability status and schedule
- `/interpreter/preferences` — job type, location, urgent jobs, and notifications
- `/interpreter/earnings` — earnings summary and history

## Client experience

The client flow begins at the splash screen. First-time users complete onboarding and choose a role. Returning users are redirected to the local login screen or directly to the tabs when a verified local session exists.

The discovery-to-booking path is:

1. Search or filter interpreters.
2. Open an interpreter profile.
3. Favorite the interpreter or start a conversation.
4. Choose Book Now.
5. Complete the virtual or in-person booking form.
6. Review date, time, duration, purpose, notes, and rate.
7. Choose card or bank transfer.
8. Finish the local payment demonstration.
9. View the pending booking and appointment details.
10. Reschedule, cancel, complete, and rate the appointment.

New bookings are written with `status: "pending"` and `interpreterStatus: "pending"` so the interpreter side can see them as requests. Accepted jobs move to `upcoming`/`accepted`; completed jobs move to `completed`.

The urgent Agent path is:

1. Open SignBee Agent from the home screen.
2. Choose In-person or Virtual.
3. Describe the situation.
4. Provide a location or preferred virtual platform.
5. Submit the request.
6. See the triage state: request read, availability filtered, and match ranked by fit.
7. See the matched interpreter and the SignBee Agent monitoring state.
8. Message the matched interpreter or return home.

## Interpreter experience

Interpreter users see a role-aware dashboard and tab bar. The jobs list reads the same `bookings` collection used by the client. Pending jobs can be accepted or declined. Accepted jobs appear in upcoming work, and completing a job creates a local earnings entry.

Interpreter profile changes persist through `AppContext` and are reflected in the client-facing interpreter listing in the same local session. This demonstrates the intended shared-state contract, but it is not multi-device synchronization.

## Shared state and persistence

`context/AppContext.tsx` owns:

- User, role, verification state, and onboarding
- Interpreter listings and favorites
- Booking draft and booking lifecycle
- Saved cards, transactions, wallet balances, and payment state
- Conversations, messages, notifications, and call state
- Interpreter profile, credentials, availability, preferences, and earnings
- Addresses, support requests, referrals, and rewards

State is restored on launch from AsyncStorage. Logout clears user-specific keys, including bookings, financial demo state, conversations, notifications, addresses, referrals, rewards, interpreter profile, interpreter earnings, and the role selector. On-device state is intentionally simple for prototyping and must be replaced or protected before handling real user data.

## Payments and wallet

The payment UI supports:

- Saved card metadata with masked last four digits
- Card payment form validation
- Bank transfer instruction flow
- Booking payment confirmation
- Wallet top-up
- Withdrawal destination and payment PIN checks
- Transaction history and details

The implementation records successful local transactions and updates the local wallet for top-ups and withdrawals. It does not contact a processor, verify a bank transfer, tokenize a card, or create a server-side financial record. Never enter real card numbers or financial credentials into this prototype.

## Design and Figma

The implementation follows the SignBee design direction:

- Primary electric green: `#AAFF00`
- Dark navy: `#1A1340`
- Green tint: `#E8FFB0`
- Neutral white and soft-gray surfaces
- Inter typography
- Feather/SF Symbol iconography
- Rounded cards, clear status labels, and accessible action targets

Source design file: [SignBee in Figma](https://www.figma.com/design/jlwNxDyjd8rrAq3O1Poxrh/SignBee--Copy-?node-id=0-1)

The Figma file currently identifies itself as **SignBee (Copy)** and contains three top-level pages. The app uses the repository’s existing assets and tokens rather than introducing a second visual system.

## Setup

### Requirements

- Node.js 20 or newer
- npm 10 or newer
- Expo Go for physical-device testing, or an Android/iOS simulator

### Install

```bash
git clone https://github.com/SagsMan/SignBEE.git
cd SignBEE
npm install
```

### Run on a device or simulator

```bash
npm start
npm run android
npm run ios
npm run web
```

Scan the QR code with Expo Go on a device. iOS simulator commands require macOS and Xcode.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Strict TypeScript check |
| `npm run start` | Start Expo Metro |
| `npm run web` | Start Expo web |
| `npm run android` | Start Expo for Android |
| `npm run ios` | Start Expo for iOS |
| `npm run build` | Prepare the static Expo Go deployment bundle |
| `npm run serve` | Serve an existing `static-build/` directory |
| `npx expo-doctor` | Check Expo config and dependency alignment |
| `npx expo prebuild --platform android` | Generate native Android files when needed |

The Replit development workflow uses:

```bash
npx expo start --web --port 3000
```

Do not commit `node_modules`, generated native folders, static build output, keystores, certificates, API keys, or payment credentials.

## Expo and release configuration

The app keeps the existing identifiers:

- iOS bundle identifier: `com.signbee.app`
- Android package: `com.signbee.app`
- App name: `SignBee`
- Slug: `signbee`
- Version: `1.0.0`

`app.json` contains only static Expo configuration. The placeholder EAS project ID was removed so a fake project identifier cannot be mistaken for a configured release project. Run EAS project setup in the owner’s Expo account before an App Store or Play Store release.

`eas.json` includes:

- Development build profile
- Internal preview APK profile
- Production Android App Bundle profile

Store submission credentials are intentionally not stored in this repository. Configure them through Expo/EAS or the release environment.

## Backend dependencies

The following services are required for a production product:

| Capability | Current prototype | Production requirement |
| --- | --- | --- |
| Authentication | Local demo login/register | Auth provider, password hashing, email verification, sessions |
| User and interpreter data | In-memory defaults + AsyncStorage | Hosted database and API |
| Booking synchronization | Shared state on one device | Server-side booking service and conflict handling |
| Agent matching | Local deterministic demo matching | Agent orchestration, availability search, ranking, dispatch, and replacement monitoring |
| Payments | Local card/bank-transfer simulation | PCI-aware payment provider and server-side ledger |
| Wallet and withdrawals | Local arithmetic | Regulated payout/payment provider and reconciliation |
| Messaging | AsyncStorage conversations | Authenticated real-time messaging service |
| Audio/video calls | Local incoming-call UI | WebRTC/media provider and signaling backend |
| Push notifications | Local notification list | Push notification service and notification worker |
| Image attachments | Local device URI | Authenticated cloud object storage |
| Support | Saved locally | Support ticket API, email, or helpdesk integration |
| Credential review | Pending local records | Secure upload, reviewer workflow, and verification service |
| Location | Device permission and mock discovery | Maps/geocoding or location service as required |

The app should present these as unavailable or demo-only until the corresponding service is connected. Do not treat local success states as proof of real payment, delivery, verification, or synchronization.

## QA checklist

### Client

- [x] Launch and splash redirect
- [x] Onboarding and role selection
- [x] Registration, login, and verification demo
- [x] Home and interpreter discovery
- [x] Search and filters
- [x] Interpreter profile and favorites
- [x] Profile-to-message navigation
- [x] SignBee Agent request form
- [x] Agent triage and matching state
- [x] Agent matched-interpreter monitoring screen
- [x] Agent-to-interpreter message action
- [x] Virtual and in-person booking
- [x] Date and time selection
- [x] Booking review and confirmation
- [x] Card and bank-transfer demo flows
- [x] Booking status, details, reschedule, cancellation, completion, and rating routes
- [x] Wallet, transactions, top-up, withdrawal, and payment PIN routes
- [x] Messages, notifications, profile, support, referrals, rewards, and logout routes

### Interpreter

- [x] Dashboard and role-aware tabs
- [x] Availability status and schedule
- [x] Jobs, filters, and job details
- [x] Accept, decline, upcoming, completed, and cancelled states
- [x] Credentials, sign languages, experience, and preferences
- [x] Interpreter profile, earnings, messages, notifications, and logout

### General

- [x] Route files and dynamic route targets audited
- [x] Client/interpreter booking state contract aligned
- [x] Local persistence and logout reset reviewed
- [x] TypeScript typecheck
- [x] Expo web workflow startup
- [x] Expo config validation and dependency audit run
- [ ] Expo SDK dependency alignment (the existing Expo Router 4 / React Native 0.76 set is intentionally preserved; `expo-doctor` reports upgrade recommendations)
- [ ] Production auth, payment, push, messaging, storage, and call providers
- [ ] Store build with an owner-configured EAS project

## Known limitations

1. A local login accepts the entered credentials and does not validate a stored password.
2. The verification code is a fixed local demo value and is not emailed.
3. AsyncStorage is shared at the device level and is not encrypted.
4. The payment PIN uses a local demo hash and is not a substitute for secure authentication.
5. Agent triage and interpreter matching are local demo behavior; they do not call an AI service or live availability/matching backend.
6. Payment, wallet, withdrawal, support, messages, calls, notifications, referrals, and rewards do not leave the device.
7. Interpreter availability and profile data do not synchronize between different devices.
8. EAS project and store credentials are not present in the repository by design.

These limitations are documented so a future backend phase can replace the local seams without claiming that unavailable infrastructure already exists.