import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Nav() {
  const [location] = useLocation();
  const { state: { items } } = useCart();
  const [open, setOpen] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = location.startsWith("/admin");

  const links = isAdmin ? [
    { href: "/admin/orders", label: "הזמנות" },
    { href: "/admin/menu", label: "תפריט" }
  ] : [
    { href: "/", label: "דף הבית" },
    { href: "/menu", label: "תפריט" },
  ];

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a>
                  <img src="/logo.png" alt="פיצה פצץ קדימה" className="h-12 w-auto" />
                </a>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {links.map(link => (
              <Link key={link.href} href={link.href}>
                <a className={`px-3 py-2 rounded-md text-sm font-medium
                  ${location === link.href 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-accent"}`}>
                  {link.label}
                </a>
              </Link>
            ))}

            {!isAdmin && (
              <Link href="/cart">
                <Button variant="outline" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  {links.map(link => (
                    <Link key={link.href} href={link.href}>
                      <a onClick={() => setOpen(false)}
                        className={`px-3 py-2 rounded-md text-sm font-medium
                        ${location === link.href 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground hover:bg-accent"}`}>
                        {link.label}
                      </a>
                    </Link>
                  ))}

                  {!isAdmin && (
                    <Link href="/cart">
                      <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(false)}>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        סל קניות ({itemCount})
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}