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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

const CREAM_PRICE = 300; // 3₪ תוספת להקרמה

interface GarlicBreadCardProps {
  item: MenuItem;
  defaultSize?: "S" | "M" | "L" | "XL";
}

export function GarlicBreadCard({ item, defaultSize = "M" }: GarlicBreadCardProps) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [withCream, setWithCream] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateQuantity = (newQuantity: number) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price;
    const creamPrice = withCream ? CREAM_PRICE : 0;
    return (basePrice + creamPrice) * quantity;
  };

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        pizzaId: item.id,
        pizza: item,
        size: defaultSize,
        quantity: quantity,
        toppingLayout: {
          layout: "full",
          sections: [[]]
        },
        isCreamSauce: false,
        isVeganCheese: false,
        isGratin: withCream,
      },
    });
    setIsDialogOpen(false);
    setQuantity(1);
    setWithCream(false);
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
            src={item.imageUrl}
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">התאם את {item.name} לטעמך</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
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
                <Label>כמות</Label>
              </div>

              <div className="flex items-center justify-between">
                <Switch
                  checked={withCream}
                  onCheckedChange={setWithCream}
                />
                <Label>הקרמה (+ ₪3)</Label>
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
