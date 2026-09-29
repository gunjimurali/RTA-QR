import "./globals.css";

export const metadata = {
  title: "RTA Unique QR Generator",
  description: "Generate unique QR verification records"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
