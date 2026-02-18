# 🕒 TaskApp

A modern, high-performance task management application built with **React Native** and **Expo**. TaskApp helps you stay organized with a seamless experience across tasks, calendar views, and focused productivity sessions.

---

## ✨ Key Features

- **🗓️ Smart Calendar Integration**: Visualize your tasks and schedule with an intuitive calendar interface.
- **🎯 Focus Mode**: Dedicated session timer to help you concentrate on deep work.
- **🔔 Real-time Notifications**: Never miss a deadline with scheduled reminders.
- **💾 Persistent Storage**: Your data is saved locally using high-performance storage solutions.
- **🎨 Beautiful UI**: Crafted with **NativeWind** (Tailwind CSS) for a sleek, modern, and responsive design.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (Link-based routing)
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/)
- **State & Storage**: React Context + Async Storage
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## 📂 Project Structure

This project follows a clean, layered architecture, separating the routing logic from the core application source:

```text
├── app/              # Expo Router (Tabs, Layouts, Screens)
│   └── (tabs)/       # Main application tabs
├── src/              # Source code
│   ├── components/   # Reusable UI components
│   ├── contexts/     # Global state (Theme, Tasks)
│   ├── hooks/        # Custom React hooks
│   ├── services/     # Logic services (Storage, Notifications)
│   └── types/        # TypeScript interfaces
├── assets/           # Static assets (Images, Fonts)
└── global.css        # Tailwind / Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/go) app on your mobile device (optional for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

---

## 📱 Development

In the output of `npx expo start`, you can choose:
- Press `i` to open in the **iOS Simulator**.
- Press `a` to open in the **Android Emulator**.
- Scan the QR code with **Expo Go** to run on your physical device.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve TaskApp.

---

*Made with ❤️ using Expo and React Native.*

