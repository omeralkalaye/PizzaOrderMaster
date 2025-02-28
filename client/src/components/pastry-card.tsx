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

interface PastryCardProps {
  item: MenuItem;
}

export function PastryCard({ item }: PastryCardProps) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSpicy, setIsSpicy] = useState(false);
  const [extraCheese, setExtraCheese] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const EXTRA_CHEESE_PRICE = 300; // 3₪ לתוספת גבינה

  const updateQuantity = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price;
    const cheesePrice = extraCheese ? EXTRA_CHEESE_PRICE : 0;
    return (basePrice + cheesePrice) * quantity;
  };

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        pizzaId: item.id,
        pizza: item,
        size: "M",
        quantity,
        toppingLayout: {
          layout: "full",
          sections: [[]]
        },
        doughType: "thick",
        isCreamSauce: false,
        isVeganCheese: false,
        isSpicy,
        extraCheese,
      },
    });
    setIsDialogOpen(false);
    setQuantity(1);
    setIsSpicy(false);
    setExtraCheese(false);
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
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto my-8">
            <DialogHeader>
              <DialogTitle className="text-center">{item.name}</DialogTitle>
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

              <div className="space-y-4">
                {/* חריף */}
                <div className="flex items-center justify-between flex-row-reverse">
                  <Label htmlFor="spicy">חריף</Label>
                  <Switch
                    id="spicy"
                    checked={isSpicy}
                    onCheckedChange={setIsSpicy}
                  />
                </div>

                {/* תוספת גבינה */}
                <div className="flex items-center justify-between flex-row-reverse">
                  <Label htmlFor="extra-cheese">תוספת גבינה (+ ₪3)</Label>
                  <Switch
                    id="extra-cheese"
                    checked={extraCheese}
                    onCheckedChange={setExtraCheese}
                  />
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