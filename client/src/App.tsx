import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import Calculator from "./pages/Calculator";
import Reference from "./pages/Reference";
import PaymentSuccess from "./pages/PaymentSuccess";
import Account from "./pages/Account";
import Redeem from "./pages/Redeem";
import Certificate from "./pages/Certificate";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDesigns from "./pages/admin/AdminDesigns";
import AdminDesignDetail from "./pages/admin/AdminDesignDetail";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import CPD from "./pages/CPD";
import AdminCpdRequests from "./pages/admin/AdminCpdRequests";
import CpdSuccess from "./pages/CpdSuccess";
import ForContractors from "./pages/ForContractors";

function Router() {
  return (
    <Switch>
      {/* Public & authenticated routes */}
      <Route path="/" component={Home} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/reference" component={Reference} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/account" component={Account} />
      <Route path="/my-designs" component={Account} />
      <Route path="/certificate/:id" component={Certificate} />
      <Route path="/redeem" component={Redeem} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/cpd" component={CPD} />
      <Route path="/cpd-success" component={CpdSuccess} />
      <Route path="/for-contractors" component={ForContractors} />

      {/* Admin routes — wrapped in AdminLayout with role check */}
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={AdminDashboard} />
            <Route path="/users" component={AdminUsers} />
            <Route path="/designs" component={AdminDesigns} />
            <Route path="/designs/:id" component={AdminDesignDetail} />
            <Route path="/cpd-requests" component={AdminCpdRequests} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <PwaInstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
