import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans" dir="rtl">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">פיצה אקספרס</h1>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Switch>
          <Route path="/">
            <div>דף הבית</div>
          </Route>
          <Route path="/menu">
            <div>תפריט</div>
          </Route>
          <Route path="/pizza-menu">
            <div>תפריט פיצות</div>
          </Route>
          <Route path="/garlic-bread-menu">
            <div>תפריט לחמי שום</div>
          </Route>
          <Route path="/pasta-menu">
            <div>תפריט פסטות</div>
          </Route>
          <Route path="/pastries-menu">
            <div>תפריט מאפים</div>
          </Route>
          <Route path="/cart">
            <div>עגלת קניות</div>
          </Route>
          <Route>
            <div>דף לא נמצא</div>
          </Route>
        </Switch>
      </main>

      <Toaster />
    </div>
  );
}