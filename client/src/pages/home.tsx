import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center px-4">
          {/* לוגו גדול */}
          <div className="h-40 flex items-center justify-center mb-20">
            <img 
              src="/logo.png" 
              alt="פיצה פצץ קדימה" 
              className="w-40 md:w-56 mx-auto"
            />
          </div>

          {/* כפתור הזמנה מעוצב */}
          <Link href="/menu">
            <Button 
              size="lg" 
              className="text-xl px-12 py-6 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 hover:from-yellow-500 hover:via-red-600 hover:to-yellow-500 text-white font-bold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              הזמן עכשיו 🍕
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-red-600">מרכיבים טריים</h3>
          <p className="text-muted-foreground">
            אנחנו משתמשים רק במרכיבים הטריים ביותר
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-red-600">משלוח מהיר</h3>
          <p className="text-muted-foreground">
            פיצה חמה וטרייה מגיעה עד דלתך
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-red-600">הזמנה בהתאמה אישית</h3>
          <p className="text-muted-foreground">
            התאם את הפיצה שלך עם התוספות האהובות עליך
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-red-600">
            הפיצות שלנו
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <img
              src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca"
              alt="פיצה מרגריטה"
              className="rounded-lg aspect-square object-cover hover:opacity-80 transition-opacity shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1585238342024-78d387f4a707"
              alt="פיצה ארבע גבינות"
              className="rounded-lg aspect-square object-cover hover:opacity-80 transition-opacity shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1571066811602-716837d681de"
              alt="פיצה פטריות"
              className="rounded-lg aspect-square object-cover hover:opacity-80 transition-opacity shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e"
              alt="פיצה ירקות"
              className="rounded-lg aspect-square object-cover hover:opacity-80 transition-opacity shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}