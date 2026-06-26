import "./globals.css";
import Providers from "./providers";
import { Barlow } from "next/font/google";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={barlow.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}