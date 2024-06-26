import type { Metadata } from 'next'
import { Suspense } from 'react'
import './styles/globals.css'
import Loading from './loading'
import Footer from '@/components/Footer/Footer'
import PopupMessageComponent from '@/components/PopupMessage/PopupMessage'
import PopupComponent from '@/components/Popup/Popup'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'


export const metadata: Metadata = {
  metadataBase: new URL('https://next.mccreations.net'),
  title: "MCCreations | The greatest Minecraft Maps from the Minecraft Community",
  description: "MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!",
  twitter: {
    title: "MCCreations | The greatest Minecraft Maps from the Minecraft Community",
    description: "MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!",
    card: "summary_large_image",
    images: [
      "https://static.wixstatic.com/media/88050d_fae65a7c6b5d4aab94aa955684b7dedf~mv2.png"
    ]
  },
  openGraph: {
    title: "MCCreations | The greatest Minecraft Maps from the Minecraft Community",
    description: "MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!",
    images: [
      "https://static.wixstatic.com/media/88050d_fae65a7c6b5d4aab94aa955684b7dedf~mv2.png"
    ],
    siteName: "MCCreations",
    type: "website",
    url: "https://next.mccreations.net"
  }
}
 
export default function RootLayout({ children }: {children: React.ReactNode}) {
 return (
    <html lang="en">
      <head>
        <meta property="og:image:width" content="2500"></meta>
        <meta property="og:image:height" content="1408"></meta>
        <meta property="og:url" content="https://www.mccreations.net"></meta>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5425604215170333"
     crossOrigin="anonymous"></Script>
      </head>
      <body id="view">
        <PopupMessageComponent />
        <PopupComponent />
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
        <Footer></Footer>
        <Analytics />
    </body>
    </html>
  )
}
