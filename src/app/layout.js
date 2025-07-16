import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/app/context/ThemeContext'; // ✅ ensure path is correct

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AlumniConnect",
  description: "A platform for alumni and students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans`}>
        <ThemeProvider>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
