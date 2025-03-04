import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./lib/cart";
import { DeliveryProvider } from "./lib/delivery-context";
import { Nav } from "./components/nav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import PizzaMenu from "@/pages/pizza-menu";
import GarlicBreadMenu from "@/pages/garlic-bread-menu";
import PastaMenu from "@/pages/pasta-menu";
import PastriesMenu from "@/pages/pastries-menu";
import Cart from "@/pages/cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/pizza-menu" component={PizzaMenu} />
      <Route path="/garlic-bread-menu" component={GarlicBreadMenu} />
      <Route path="/pasta-menu" component={PastaMenu} />
      <Route path="/pastries-menu" component={PastriesMenu} />
      <Route path="/cart" component={Cart} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <DeliveryProvider>
          <Nav />
          <Router />
          <Toaster />
        </DeliveryProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;