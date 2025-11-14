import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuthSync } from "@/hooks/useAuthSync";
import { useSmartReminders } from "@/hooks/useSmartReminders";
import { useNotificationTriggers } from "@/hooks/useNotificationTriggers";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import CVList from "./pages/CVList";
import CVBuilder from "./pages/CVBuilder";
import InterviewLanding from "./pages/InterviewLanding";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewSession from "./pages/InterviewSession";
import InterviewResults from "./pages/InterviewResults";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import GuestStart from "./pages/GuestStart";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  useAuthSync();
  useSmartReminders();
  useNotificationTriggers();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthSyncWrapper>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/guest-start" element={<GuestStart />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
          
          {/* Dashboard routes with shared sidebar layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute requireOnboarding={true}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="cvs" element={<CVList />} />
            <Route path="cvs/:id" element={<CVBuilder />} />
            <Route path="interviews" element={<InterviewLanding />} />
            <Route path="interviews/setup" element={<InterviewSetup />} />
            <Route path="interviews/session" element={<InterviewSession />} />
            <Route path="interviews/results" element={<InterviewResults />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities/:id" element={<OpportunityDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
          </AuthSyncWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
