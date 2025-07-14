import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">WhatsApp SaaS Multi-Cliente</h1>
      </header>
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}