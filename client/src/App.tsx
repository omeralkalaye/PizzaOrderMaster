import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./lib/cart";
import { AuthProvider } from "./hooks/use-auth";
import { Nav } from "./components/nav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import PizzaMenu from "@/pages/pizza-menu";
import GarlicBreadMenu from "@/pages/garlic-bread-menu";
import PastaMenu from "@/pages/pasta-menu";
import Cart from "@/pages/cart";
import Payment from "@/pages/payment";
import Auth from "@/pages/auth";
import AdminOrders from "@/pages/admin/orders";
import AdminMenu from "@/pages/admin/menu";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/pizza-menu" component={PizzaMenu} />
      <Route path="/garlic-bread-menu" component={GarlicBreadMenu} />
      <Route path="/pasta-menu" component={PastaMenu} />
      <Route path="/cart" component={Cart} />
      <Route path="/payment" component={Payment} />
      <Route path="/auth" component={Auth} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/menu" component={AdminMenu} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Nav />
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;