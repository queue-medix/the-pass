import { Poppins } from "next/font/google"

export const geistSans = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
  weight: [`100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`],
})
