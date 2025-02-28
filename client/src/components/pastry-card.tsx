import { MenuItem } from "@shared/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PastryCardProps {
  item: MenuItem;
}

export function PastryCard({ item }: PastryCardProps) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSpicy, setIsSpicy] = useState(false);
  const [extraSpicy, setExtraSpicy] = useState(0); // כמות חריף נוסף בתשלום
  const [smallSauce, setSmallSauce] = useState(0); // כמות רסק קטן
  const [largeSauce, setLargeSauce] = useState(0); // כמות רסק גדול
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // מערך של מרכיבים מוסרים לכל פריט בנפרד
  const [itemsRemovedIngredients, setItemsRemovedIngredients] = useState<string[][]>([[]]);

  // מחירי תוספות
  const EXTRA_SPICY_PRICE = 200; // 2₪ לתוספת חריף
  const SMALL_SAUCE_PRICE = 300; // 3₪ לרסק קטן
  const LARGE_SAUCE_PRICE = 500; // 5₪ לרסק גדול

  const getAvailableIngredients = () => {
    switch (item.name) {
      case "מלאווח פתוח":
        return ["ביצה קשה", "רסק עגבניות"];
      case "מלאווח משובח":
        return ["ביצה קשה", "רסק עגבניות"];
      case "מלאווח יווני":
        return ["ביצה", "רסק", "זיתים שחורים", "בצל", "גבינה בולגרית", "זעתר"];
      case "מלאווח מעורב":
        return ["ביצה", "רסק", "גבינה צהובה", "גבינה בולגרית"];
      case "מלאווח טוניסאי":
        return ["ביצה", "רסק", "זיתים ירוקים", "טונה"];
      case "מלאווח הבית":
        return ["ביצה", "רסק", "גבינה בולגרית", "טונה", "פטריות"];
      case "ג'חנון":
        return ["ביצה קשה", "רסק עגבניות"];
      default:
        return [];
    }
  };

  const updateQuantity = (newQuantity: number) => {
    const currentQuantity = Math.max(1, newQuantity);
    setQuantity(currentQuantity);

    // עדכון מערך המרכיבים המוסרים בהתאם לכמות החדשה
    setItemsRemovedIngredients(current => {
      if (currentQuantity > current.length) {
        // הוספת מערכים ריקים עבור הפריטים החדשים
        return [...current, ...Array(currentQuantity - current.length).fill([])];
      } else {
        // הסרת מערכים עודפים
        return current.slice(0, currentQuantity);
      }
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price * quantity;
    const extraSpicyTotal = extraSpicy * EXTRA_SPICY_PRICE;
    const smallSauceTotal = smallSauce * SMALL_SAUCE_PRICE;
    const largeSauceTotal = largeSauce * LARGE_SAUCE_PRICE;
    return basePrice + extraSpicyTotal + smallSauceTotal + largeSauceTotal;
  };

  const handleAddToCart = () => {
    // הוספת פריט נפרד עבור כל כמות, עם ההגדרות הייחודיות שלו
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          pizzaId: item.id,
          pizza: item,
          size: "M",
          quantity: 1, // כל פריט בנפרד
          toppingLayout: {
            layout: "full",
            sections: [[]]
          },
          doughType: "thick",
          isSpicy,
          extraSpicy,
          smallSauce,
          largeSauce,
          removedIngredients: itemsRemovedIngredients[i],
        },
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setQuantity(1);
    setIsSpicy(false);
    setExtraSpicy(0);
    setSmallSauce(0);
    setLargeSauce(0);
    setItemsRemovedIngredients([[]]);
    setCurrentItemIndex(0);
  };

  const toggleIngredient = (ingredient: string) => {
    setItemsRemovedIngredients(current => {
      const newItems = [...current];
      const currentIngredients = newItems[currentItemIndex] || [];

      newItems[currentItemIndex] = currentIngredients.includes(ingredient)
        ? currentIngredients.filter(i => i !== ingredient)
        : [...currentIngredients, ingredient];

      return newItems;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-center">
          <span>{item.name}</span>
          <span className="text-lg">
            ₪{(item.price / 100).toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative rounded-md overflow-hidden mb-4">
          <img
            src={item.imageUrl || ""}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">{item.description}</p>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">בחר</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto my-8">
            <DialogHeader>
              <DialogTitle className="text-center">התאם את {item.name} לטעמך</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* כמות */}
              <div className="flex items-center justify-between flex-row-reverse">
                <Label>כמות</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {quantity > 1 && (
                <div className="space-y-4">
                  <Label className="block">הגדרות לכל פריט:</Label>
                  <Tabs value={currentItemIndex.toString()} onValueChange={(value) => setCurrentItemIndex(parseInt(value))}>
                    <TabsList className="w-full flex flex-row-reverse">
                      {Array.from({ length: quantity }, (_, index) => (
                        <TabsTrigger key={index} value={index.toString()}>
                          פריט {index + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value={currentItemIndex.toString()}>
                      {/* הסרת מרכיבים לפריט הנוכחי */}
                      <div className="space-y-4">
                        <Label className="block mb-2">הסר מרכיבים:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {getAvailableIngredients().map((ingredient) => (
                            <div key={ingredient} className="flex items-center justify-between p-2 border rounded">
                              <Label htmlFor={`remove-${ingredient}-${currentItemIndex}`}>{ingredient}</Label>
                              <Switch
                                id={`remove-${ingredient}-${currentItemIndex}`}
                                checked={itemsRemovedIngredients[currentItemIndex]?.includes(ingredient)}
                                onCheckedChange={() => toggleIngredient(ingredient)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              <div className="border-t pt-4">
                <Label className="block mb-4 text-lg">תוספות משותפות לכל הפריטים:</Label>
                {/* חריף */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-row-reverse">
                    <Label htmlFor="spicy">חריף (חינם)</Label>
                    <Switch
                      id="spicy"
                      checked={isSpicy}
                      onCheckedChange={setIsSpicy}
                    />
                  </div>

                  {isSpicy && (
                    <div className="flex items-center justify-between flex-row-reverse">
                      <Label>תוספת חריף (₪2 ליחידה)</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setExtraSpicy(Math.max(0, extraSpicy - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{extraSpicy}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setExtraSpicy(extraSpicy + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* רסק נוסף */}
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between flex-row-reverse">
                    <Label>רסק קטן (₪3 ליחידה)</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSmallSauce(Math.max(0, smallSauce - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{smallSauce}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSmallSauce(smallSauce + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-row-reverse">
                    <Label>רסק גדול (₪5 ליחידה)</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setLargeSauce(Math.max(0, largeSauce - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{largeSauce}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setLargeSauce(largeSauce + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 border rounded-lg">
                <div className="flex justify-between text-lg font-bold">
                  <span>₪{(calculateTotalPrice() / 100).toFixed(2)}</span>
                  <span>:סה"כ לתשלום</span>
                </div>
              </div>

              <Button onClick={handleAddToCart} className="w-full">
                הוסף לסל
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}