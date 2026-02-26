import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Exploits from "./pages/Exploits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background">
          <TopNav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/exploits" element={<Exploits />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
