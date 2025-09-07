import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/context/useAuth";
import { ThemeProvider } from '@/context/useTheme'
import { CaseProvider } from "@/context/useCase";
import { ProfileProvider } from "@/context/useProfile";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthenticatedLayout, ProtectedRoute } from "@/components/layout/ProtectedLayout";

import LandingPage from "@/features/authentication/pages/LandingPage";
import LoginPage from "@/features/authentication/pages/LoginPage";
import LoadingPage from "@/features/authentication/pages/LoadingPage";
import NotFound from "@/features/authentication/pages/NotFound";

import HomePage from "@/features/dashboard/pages/HomePage";
import ViewCasesPage from "@/features/dashboard/pages/Cases/ViewCasesPage";
import CaseDetailsPage from "@/features/dashboard/pages/Cases/CaseDetailsPage";
import AddCasePage from "@/features/dashboard/pages/Cases/AddCasePage";
import MapPage from "@/features/dashboard/pages/MapPage";
import PatientsPage from "@/features/dashboard/pages/PatientsPage";
import ProfilePage from "@/features/personalization/pages/ProfilePage";
import SettingsPage from "@/features/personalization/pages/SettingsPage";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <CaseProvider>
            <TooltipProvider>
              <Toaster />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/loading" element={<LoadingPage />} />
                <Route path="*" element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <Routes>
                        <Route path="/dashboard" element={<HomePage />} />
                        <Route path="/view-cases" element={<ViewCasesPage />} />
                        <Route path="/add-case" element={<AddCasePage />} />
                        <Route path="/case/:id" element={<CaseDetailsPage />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/patients" element={<PatientsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </TooltipProvider>
          </CaseProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
