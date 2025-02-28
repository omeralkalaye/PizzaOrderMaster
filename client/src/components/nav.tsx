import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Menu, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export function Nav() {
  const [location, navigate] = useLocation();
  const { state: { items } } = useCart();
  const [open, setOpen] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = location.startsWith("/admin");

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const links = isAdmin ? [
    { href: "/admin/orders", label: "הזמנות" },
    { href: "/admin/menu", label: "תפריט" }
  ] : [
    { href: "/", label: "דף הבית" },
    { href: "/menu", label: "תפריט" },
  ];

  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* לוגו */}
              <Link href="/">
                <a className="flex-shrink-0 flex items-center transition-transform hover:scale-105">
                  <img src="/logo.png" alt="פיצה פצץ קדימה" className="h-14 w-auto" />
                </a>
              </Link>
              {/* כפתור חזרה */}
              {location !== "/" && (
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-4 bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  onClick={handleBack}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:gap-4">
              {links.map(link => (
                <Link key={link.href} href={link.href}>
                  <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${location === link.href 
                      ? "bg-primary text-white" 
                      : "text-white hover:bg-yellow-400 hover:text-black"}`}>
                    {link.label}
                  </a>
                </Link>
              ))}

              {!isAdmin && (
                <Link href="/cart">
                  <Button variant="outline" className="relative bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex items-center gap-2">
              {/* כפתור סל קניות למובייל */}
              {!isAdmin && (
                <Link href="/cart">
                  <Button variant="outline" size="icon" className="relative bg-transparent border-yellow-400 text-yellow-400">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </Link>
              )}

              {/* תפריט המבורגר */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-transparent border-yellow-400 text-yellow-400">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-black text-white">
                  <div className="flex flex-col gap-4 mt-4">
                    {links.map(link => (
                      <Link key={link.href} href={link.href}>
                        <a onClick={() => setOpen(false)}
                          className={`px-3 py-2 rounded-md text-sm font-medium text-right
                          ${location === link.href 
                            ? "bg-primary text-white" 
                            : "text-white hover:bg-yellow-400 hover:text-black"}`}>
                          {link.label}
                        </a>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from being hidden under fixed nav */}
      <div className="h-16" />
    </>
  );
}