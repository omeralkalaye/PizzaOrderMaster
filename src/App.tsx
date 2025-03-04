import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Nav } from "./components/nav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import PizzaMenu from "@/pages/pizza-menu";
import GarlicBreadMenu from "@/pages/garlic-bread-menu";
import PastaMenu from "@/pages/pasta-menu";
import PastriesMenu from "@/pages/pastries-menu";
import Cart from "@/pages/cart";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-sans">
        <Nav />
        <main>
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
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}