# 💌 Vowelle - Digital Audio Guestbook

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> *"Your words, your voice, your wishes — a special message that they'll keep forever."*

Vowelle is a premium, serverless web application designed to modernize the traditional wedding guestbook. By simply scanning a QR code at their table, wedding guests can record heartfelt audio messages or write text notes for the newlyweds, all seamlessly saved to the cloud.

---

## ✨ Features

- **🎙️ One-Tap Audio Recording:** Browser-based microphone integration with a strict 60-second limit and live timer.
- **✍️ Text Message Fallback:** For guests who are shy or in a loud environment, they can easily switch to typing a message (saved as a `.txt` file).
- **🎨 Dynamic Theme Engine:** The UI automatically adapts to the specific wedding's aesthetic via URL parameters. (e.g., `/?theme=starry-night` or `/?theme=botanical`).
- **📱 Fully Responsive:** Carefully crafted CSS that looks like a native app on mobile phones, and expands to a beautiful landscape card on desktops.
- **☁️ Serverless Architecture:** Uses Cloudinary's Unsigned Direct Upload API. Audio (`.webm`/`.mp3`) and text (`.txt`) files are sent directly from the browser to the cloud, completely bypassing the need for a traditional backend server.