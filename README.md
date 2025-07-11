# SumoArts 🎨 Digital Art Gallery

SumoArts is a modern, lofi-aesthetic digital art gallery platform where artists can showcase their work and art enthusiasts can discover, collect, and purchase unique artworks. Built with React, featuring a terminal-inspired design with cyberpunk elements.

This project represents a complete digital art marketplace with a unique lofi/cyberpunk aesthetic, focusing on clean design and smooth user experience.

🔗 [Visit SumoArts Gallery](#)

<img src="public/images/screenshots/home-page.png" alt="SumoArts Home Page" width="500" />

<br>

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Design Philosophy](#design-philosophy)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Preview](#preview)

## Key Features

#### 🎨 For Artists 

- **Gallery Studio**: Pinterest-style upload interface with drag & drop
- **Artist Dashboard**: Complete artwork management system
- **Professional Presentation**: Lofi-styled artwork showcasing
- **Custom Collections**: Organize artworks by size and category

#### 💖 For Art Collectors
 
- **Curated Discovery**: Browse through carefully selected artworks
- **Smart Collections**: Save favorites with advanced filtering
- **Secure Purchasing**: Streamlined checkout experience
- **Collector Dashboard**: Track purchases and favorite artists

#### 💫 User Experience

- **Lofi Aesthetic**: Terminal-inspired design with cyberpunk elements
- **JetBrains Mono Typography**: Consistent coding-style fonts
- **Responsive Design**: Optimized for all devices
- **Smooth Animations**: Glitch effects and hover transitions
- **Terminal Navigation**: Back buttons with breadcrumb systems

#### 🔐 Technology & Performance

- **React 18**: Modern component architecture
- **Firebase Integration**: Real-time data and authentication
- **Advanced State Management**: Context API for seamless data flow
- **Real-time Updates**: Live artwork and user data synchronization
- **Hybrid Content**: Firebase + curated external art sources

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for utility-first styling
- **React Router v7** for seamless navigation
- **React Context API** for global state management
- **React Hot Toast** for elegant notifications

### Backend & Services
- **Firebase Authentication** for secure user management
- **Firebase Firestore** for real-time database
- **Unsplash API** for curated artwork integration
- **Base64 Storage** for efficient image handling

### Design System
- **JetBrains Mono** typography for coding aesthetic
- **Lofi Color Palette** with orange (#FFA500) accents
- **Terminal-inspired UI** with glitch effects
- **Responsive Grid Layouts** for optimal viewing

## Design Philosophy

SumoArts embraces a **lofi cyberpunk aesthetic** that combines:

- **Terminal Aesthetics**: Command-line inspired interfaces
- **Coding Typography**: JetBrains Mono throughout
- **Glitch Effects**: Subtle animations and hover states
- **Dark Theme**: Professional dark backgrounds with orange accents
- **Clean Minimalism**: "Pure Art. No Gatekeepers." philosophy

## Project Structure

```
src/     
├── components/       
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components  
│   └── layout/         # Navigation and layout
├── contexts/           
│   └── AuthContext/    # Global state management
├── pages/              
│   ├── HomePage/       # Landing with gallery slider
│   ├── GalleryStudio/  # Pinterest-style upload
│   ├── ForArtLoversPage/ # Art discovery
│   ├── ArtistDashboard/  # Artist management
│   └── [other pages]/   
├── config/             
│   └── firebase.js     # Firebase configuration
└── styles/             
    └── index.css       # Global lofi styling
```

## Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd sumoarts-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Add your config to `src/config/firebase.js`
   - Enable Authentication and Firestore

4. **Add environment variables**
   ```bash
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Preview

#### SumoArts Home - Lofi Gallery Experience
![SumoArts Home](public/images/screenshots/home-page.png)

#### Gallery Studio - Pinterest-Style Upload
![Gallery Studio](public/images/screenshots/artist-dashboard.png)

#### Art Discovery - Terminal-Inspired Browsing
![Art Discovery](public/images/screenshots/for-art-lovers-page.png)

#### Artist Dashboard - Professional Management
![Artist Dashboard](public/images/screenshots/art-gallery.png)

<br>

---

**SumoArts** - Where creativity meets technology in a lofi digital space.  
Built with modern React architecture and terminal-inspired design.

*"Pure Art. No Gatekeepers."*