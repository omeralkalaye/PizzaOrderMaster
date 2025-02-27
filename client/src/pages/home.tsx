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
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <img src="/attached_assets/1.png" alt="פיצה פצץ קדימה" className="h-32 w-auto" />
        </div>
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            פיצה טעימה עד הבית
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            מרכיבים טריים, מתכונים מסורתיים ומשלוח מהיר עד דלתך
          </p>
          <Link href="/menu">
            <Button size="lg" className="text-lg px-8">
              הזמן עכשיו
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">מרכיבים טריים</h3>
          <p className="text-muted-foreground">
            אנחנו משתמשים רק במרכיבים הטריים ביותר
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">משלוח מהיר</h3>
          <p className="text-muted-foreground">
            פיצה חמה וטרייה מגיעה עד דלתך
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">הזמנה בהתאמה אישית</h3>
          <p className="text-muted-foreground">
            התאם את הפיצה שלך עם התוספות האהובות עליך
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-accent/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            הפיצות הפופולריות שלנו
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <img
              src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca"
              alt="פיצה מרגריטה"
              className="rounded-lg aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1585238342024-78d387f4a707"
              alt="פיצה ארבע גבינות"
              className="rounded-lg aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1571066811602-716837d681de"
              alt="פיצה פטריות"
              className="rounded-lg aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e"
              alt="פיצה ירקות"
              className="rounded-lg aspect-square object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}