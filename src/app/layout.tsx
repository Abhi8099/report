import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Providers from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <head>
      {/* <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/> */}
      </head>
      <body suppressHydrationWarning={true}>
<Providers>
{ children}
<SpeedInsights />
</Providers>
      </body>
    </html>

  );
}
