import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  LandingPage,
  LoginPage,
  SignupPage,
  SetupPage,
  DashboardLayout,
  DashboardOverview,
  ConversationsPage,
  KnowledgePage,
  AnalyticsPage,
  TeamPage,
  SettingsPage,
} from './pages'
import { useAuthStore } from './stores/authStore'

// Lazy load new pages for better performance
const MarketingPage = React.lazy(() => import('./pages/MarketingPage'))
const EmailTemplatesPage = React.lazy(() => import('./pages/dashboard/EmailTemplatesPage'))
const LeadsPage = React.lazy(() => import('./pages/dashboard/LeadsPage'))
const InvoicesPage = React.lazy(() => import('./pages/dashboard/InvoicesPage'))

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
    </div>
  )
}

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Public Route wrapper (redirect to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <PageLoader />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Setup (requires auth) */}
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <SetupPage />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* New Dashboard Routes */}
            <Route path="email-templates" element={<EmailTemplatesPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  )
}
