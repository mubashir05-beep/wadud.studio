import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
      <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="mb-4 text-muted-foreground">Could not find requested resource</p>
      <Link href="/" className="underline hover:text-primary">
        Return Home
      </Link>
    </div>
  )
}
