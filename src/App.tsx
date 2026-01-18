import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { useAuthSync } from "@/hooks/useAuthSync";
import { useSmartReminders } from "@/hooks/useSmartReminders";
import { useNotificationTriggers } from "@/hooks/useNotificationTriggers";
import { SkeletonDashboard } from "@/components/ui/skeleton-loader";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DashboardLayout from "./layouts/DashboardLayout";
import { AdminRoute } from "./components/AdminRoute";
import { 
  StudentRoute, 
  DiagnosticRoute, 
  UniversityAdminRoute, 
  PublicOnlyRoute 
} from "./components/routing";
import { UniversidadDataLoader } from "./components/UniversidadDataLoader";

// Lazy load pages
const Install = lazy(() => import("./pages/Install"));
const CodeAuth = lazy(() => import("./pages/CodeAuth"));
const GuestStart = lazy(() => import("./pages/GuestStart"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CVList = lazy(() => import("./pages/CVList"));
const CVBuilder = lazy(() => import("./pages/CVBuilder"));
const InterviewLanding = lazy(() => import("./pages/InterviewLanding"));
const InterviewSetup = lazy(() => import("./pages/InterviewSetup"));
const InterviewSession = lazy(() => import("./pages/InterviewSession"));
const InterviewResults = lazy(() => import("./pages/InterviewResults"));
const InterviewAI = lazy(() => import("./pages/InterviewAI"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const OpportunityDetail = lazy(() => import("./pages/OpportunityDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Universidad pages
const UniversidadesLanding = lazy(() => import("./pages/UniversidadesLanding"));
const UniversidadDashboardLayout = lazy(() => import("./layouts/UniversidadDashboardLayout"));
const UniversidadDashboard = lazy(() => import("./pages/universidad/UniversidadDashboard"));
const EstudiantesPage = lazy(() => import("./pages/universidad/EstudiantesPage"));
const ExportarPage = lazy(() => import("./pages/universidad/ExportarPage"));
const ConfiguracionPage = lazy(() => import("./pages/universidad/ConfiguracionPage"));
const AdministradoresPage = lazy(() => import("./pages/universidad/AdministradoresPage"));

const queryClient = new QueryClient();

function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  useAuthSync();
  useSmartReminders();
  useNotificationTriggers();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="clovely-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthSyncWrapper>
            <Suspense fallback={<SkeletonDashboard />}>
              <Routes>
                {/* ============ PUBLIC ROUTES ============ */}
                <Route path="/" element={<Landing />} />
                <Route path="/install" element={<Install />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* ============ AUTH ROUTES (Public Only - Redirect if authenticated) ============ */}
                <Route path="/auth" element={
                  <PublicOnlyRoute>
                    <CodeAuth />
                  </PublicOnlyRoute>
                } />
                <Route path="/login" element={
                  <PublicOnlyRoute>
                    <CodeAuth />
                  </PublicOnlyRoute>
                } />
                <Route path="/code-auth" element={
                  <PublicOnlyRoute>
                    <CodeAuth />
                  </PublicOnlyRoute>
                } />
                <Route path="/registro" element={
                  <PublicOnlyRoute>
                    <CodeAuth />
                  </PublicOnlyRoute>
                } />
                <Route path="/forgot-password" element={
                  <PublicOnlyRoute>
                    <CodeAuth />
                  </PublicOnlyRoute>
                } />
                <Route path="/reset-password" element={
                  <PublicOnlyRoute>
                    <CodeAuth />
                  </PublicOnlyRoute>
                } />
                
                {/* Guest mode entry */}
                <Route path="/guest-start" element={<GuestStart />} />
                
                {/* ============ DIAGNOSTIC/ONBOARDING (Protected - Redirects if completed) ============ */}
                <Route path="/onboarding" element={
                  <DiagnosticRoute>
                    <Onboarding />
                  </DiagnosticRoute>
                } />
            
                {/* ============ STUDENT DASHBOARD (Protected - Requires diagnostic) ============ */}
                <Route path="/dashboard" element={
                  <StudentRoute requireDiagnostic={true}>
                    <DashboardLayout />
                  </StudentRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="cvs" element={<CVList />} />
                  <Route path="cvs/:id" element={<CVBuilder />} />
                  <Route path="interviews" element={<InterviewLanding />} />
                  <Route path="interviews/setup" element={<InterviewSetup />} />
                  <Route path="interviews/session" element={<InterviewSession />} />
                  <Route path="interviews/results" element={<InterviewResults />} />
                  <Route path="interviews/ai" element={<InterviewAI />} />
                  <Route path="opportunities" element={<Opportunities />} />
                  <Route path="opportunities/:id" element={<OpportunityDetail />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* ============ UNIVERSITY PUBLIC ROUTES ============ */}
                <Route path="/universidades" element={<UniversidadesLanding />} />
                
                {/* University auth routes (redirect if authenticated university admin) */}
                <Route path="/universidad/login" element={
                  <PublicOnlyRoute universityFlow={true}>
                    <CodeAuth />
                  </PublicOnlyRoute>
                } />
                <Route path="/universidad/registro" element={
                  <PublicOnlyRoute universityFlow={true}>
                    <CodeAuth />
                  </PublicOnlyRoute>
                } />
                
                {/* ============ UNIVERSITY DASHBOARD (Protected - University admins only) ============ */}
                <Route path="/universidad/dashboard" element={
                  <UniversityAdminRoute>
                    <UniversidadDataLoader>
                      <UniversidadDashboardLayout />
                    </UniversidadDataLoader>
                  </UniversityAdminRoute>
                }>
                  <Route index element={<UniversidadDashboard />} />
                  <Route path="estudiantes" element={<EstudiantesPage />} />
                  <Route path="exportar" element={<ExportarPage />} />
                  <Route path="configuracion" element={<ConfiguracionPage />} />
                  <Route path="administradores" element={<AdministradoresPage />} />
                </Route>
            
                {/* ============ CATCH ALL ============ */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthSyncWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
