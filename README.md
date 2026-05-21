# Valanhyr // Pure Vanilla Portfolio Engine

A high-performance, zero-dependency professional portfolio built with **Vanilla Web Components**, **CSS Custom Properties**, and a **Headless CMS Simulation** architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-success.svg)

## 🛠 Technical Philosophy

This project is a showcase of "Pragmatic Modernity." It rejects the overhead of massive frameworks in favor of native browser APIs, achieving elite performance and long-term maintainability.

- **Zero-Dependency Architecture**: No React, no Angular, no Tailwind. Just standards-compliant JavaScript and CSS.
- **Web Components (Custom Elements)**: Encapsulated UI logic using the native `Shadow DOM`.
- **Async CMS Simulation**: A custom `SanityService` that mirrors the Sanity.io Headless CMS behavior, allowing for a seamless transition from local simulation to real-time data.
- **Native Test Suite**: Uses Node.js's built-in test runner for lightning-fast, dependency-free unit testing.
- **Cyberpunk Neumorphism**: A bespoke design system focused on accessibility, responsiveness, and unique visual identity.

## 🚀 Key Features

- **Skeleton-First Loading**: Every section handles asynchronous data fetching with high-fidelity skeletons.
- **Staggered Reveal System**: Centralized `IntersectionObserver` logic for coordinated entry animations.
- **Dynamic Theming**: Real-time theme switching with technical "system reboot" visual effects.
- **Resilient UI**: Comprehensive error handling ("Glitch Mode") and empty-state management.

## 📁 Architecture Overview

```text
├── src/
│   ├── components/       # Custom Elements (UI, Sections, Layout)
│   ├── services/         # Business logic & CMS Abstraction
│   ├── store/            # State management and local data simulation
│   └── styles/           # Global design tokens and theme variables
├── tests/                # Zero-dependency unit tests
└── docs/                 # Architectural Decision Records (ADRs) & Specs
```

## 🧪 Testing

The project prioritizes verification. Run the full test suite with:

```bash
node --test tests/components/*.test.js
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
**VALANHYR.SYS // Built by fjraya**
