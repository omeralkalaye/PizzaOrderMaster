import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./lib/cart";
import { Nav } from "./components/nav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Cart from "@/pages/cart";
import Payment from "@/pages/payment";
import AdminOrders from "@/pages/admin/orders";
import AdminMenu from "@/pages/admin/menu";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/cart" component={Cart} />
      <Route path="/payment" component={Payment} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/menu" component={AdminMenu} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Nav />
        <Router />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;