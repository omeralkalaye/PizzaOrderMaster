import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1594375188248-174763da4d69)',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Delicious Pizza Delivered
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Fresh ingredients, authentic recipes, and fast delivery to your door
          </p>
          <Link href="/menu">
            <Button size="lg" className="text-lg px-8">
              Order Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Fresh Ingredients</h3>
          <p className="text-muted-foreground">
            We use only the freshest ingredients in our pizzas
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Quick Delivery</h3>
          <p className="text-muted-foreground">
            Hot and fresh pizza delivered to your doorstep
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Custom Orders</h3>
          <p className="text-muted-foreground">
            Customize your pizza with your favorite toppings
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-accent/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our Popular Pizzas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591"
              alt="Pizza"
              className="rounded-lg aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee"
              alt="Pizza"
              className="rounded-lg aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1528137871618-79d2761e3fd5"
              alt="Pizza"
              className="rounded-lg aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1489564239502-7a532064e1c2"
              alt="Pizza"
              className="rounded-lg aspect-square object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
