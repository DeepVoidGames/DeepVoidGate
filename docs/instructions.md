# DeepvoidGate - Installation and Running Instructions

This document explains how to set up and run the DeepvoidGate project locally, as well as how to prepare the Android build using Capacitor.

---

## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (version 16 or higher recommended)  
  [Download Node.js](https://nodejs.org/)

- **npm** or **yarn** (comes with Node.js)

- **Vite** (installed locally as dependency, no global install required)

- **Android Studio** (for Android build)  
  [Download Android Studio](https://developer.android.com/studio)

- **Java Development Kit (JDK)**  
  Usually bundled with Android Studio, but you can also install separately (JDK 11+ recommended).

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/deepvoidgate.git
cd deepvoidgate
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

or yarn:

```bash
yarn install
```

### 3. Run development server

To start the app in development mode and access it on your local network:

```bash
npm run dev
```

This will start Vite with the server accessible at `http://localhost:5173` (default port) and bind to all interfaces (`0.0.0.0`) for LAN testing.

### 4. Build for production (Web demo)

To create a production build optimized for deployment:

```bash
npm run build
```

The build output will use the base path `https://cloud.fern.fun/deepvoidgate/demo/` as configured.

---

## Android Build with Capacitor

### 5. Prepare Android environment

- Open Android Studio.
- Make sure SDK tools and emulator are installed.
- Configure an Android device or emulator.

### 6. Build and sync with Capacitor

Run the following command to build the web app, sync with Capacitor, and open the Android project in Android Studio:

```bash
npm run build:android
```

This command performs:

- Vite production build
- `npx cap sync` to update Capacitor native projects
- `npx cap open android` to launch Android Studio with the project loaded

### 7. Run on Android device/emulator

Inside Android Studio:

- Select your connected device or emulator.
- Click **Run** (green play button) to compile and launch the app.

---

## Additional scripts

- **`npm run build:dev`** – build the app using Vite in development mode (unminified)
- **`npm run preview`** – preview the production build locally
- **`npm run lint`** – run ESLint checks on the codebase

---

## Troubleshooting

- Make sure all environment variables and Android SDK paths are correctly configured.
- Ensure Android Studio is updated with the required SDK platforms and build tools.
- If `npx cap sync` fails, try deleting `node_modules` and reinstalling dependencies.
- Use `npm run dev` for fast iteration during development.

---

If you have any questions or need help setting up, feel free to open an issue or contact the maintainer.

---

_Happy coding and exploring DeepvoidGate!_
