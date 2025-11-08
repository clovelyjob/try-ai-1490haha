import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import GoalDetail from "./pages/GoalDetail";
import CVList from "./pages/CVList";
import CVBuilder from "./pages/CVBuilder";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import InterviewLanding from "./pages/InterviewLanding";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewSession from "./pages/InterviewSession";
import InterviewHistory from "./pages/InterviewHistory";
import CircleDiscover from "./pages/CircleDiscover";
import CircleDetail from "./pages/CircleDetail";
import Rewards from "./pages/Rewards";
import Coach from "./pages/Coach";
import Settings from "./pages/Settings";
import GuestStart from "./pages/GuestStart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guest-start" element={<GuestStart />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/goals" element={<Goals />} />
          <Route path="/dashboard/goals/:id" element={<GoalDetail />} />
          <Route path="/dashboard/cvs" element={<CVList />} />
          <Route path="/dashboard/cvs/:id" element={<CVBuilder />} />
          <Route path="/dashboard/opportunities" element={<Opportunities />} />
          <Route path="/dashboard/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/dashboard/interviews" element={<InterviewLanding />} />
          <Route path="/dashboard/interviews/setup" element={<InterviewSetup />} />
          <Route path="/dashboard/interviews/session" element={<InterviewSession />} />
          <Route path="/dashboard/interviews/history" element={<InterviewHistory />} />
          <Route path="/dashboard/circles" element={<CircleDiscover />} />
          <Route path="/dashboard/circles/:id" element={<CircleDetail />} />
          <Route path="/dashboard/rewards" element={<Rewards />} />
          <Route path="/dashboard/coach" element={<Coach />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
