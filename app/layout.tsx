import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'משחק הלשון 🦎',
  description: 'מצא את כל החפצים בחדר לפני שהזמן נגמר!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
