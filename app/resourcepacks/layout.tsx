import { Suspense } from 'react'
import Footer from '@/components/Footer/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://next.mccreations.net'),
  title: "Download Resource Packs | MCCreations",
  description: "Download the latest verified Resource Packs on MCCreations! Resource Packs are a vanilla way to change to look and feel of the game. They can add new textures, sounds, and more!",
  twitter: {
    title: "Download Resource Packs | MCCreations",
    description: "Download the latest verified Resource Packs on MCCreations!",
    card: "summary_large_image",
    images: [
      "https://next.mccreations.net/defaultBanner.png"
    ]
  },
  openGraph: {
    title: "Download Resource Packs | MCCreations",
    description: "Download the latest verified Resource Packs on MCCreations!",
    images: [
      "https://next.mccreations.net/defaultBanner.png"
    ],
    siteName: "MCCreations",
    type: "website",
    url: "https://next.mccreations.net/resourcepacks"
  }
}
 
export default function ResourcepacksLayout({ children }: {children: React.ReactNode}) {
 return (
        <Suspense>
            {children}
        </Suspense>
  )
}
