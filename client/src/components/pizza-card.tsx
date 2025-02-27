import { Pizza } from "@shared/schema";
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
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface PizzaCardProps {
  pizza: Pizza;
  isAdmin?: boolean;
  onEdit?: (pizza: Pizza) => void;
}

export function PizzaCard({ pizza, isAdmin, onEdit }: PizzaCardProps) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        pizzaId: pizza.id,
        pizza,
        quantity,
      },
    });
    setQuantity(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{pizza.name}</span>
          <span className="text-lg">
            ${(pizza.price / 100).toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative rounded-md overflow-hidden mb-4">
          <img
            src={pizza.imageUrl}
            alt={pizza.name}
            className="object-cover w-full h-full"
          />
        </div>
        <p className="text-sm text-muted-foreground">{pizza.description}</p>
      </CardContent>
      <CardFooter>
        {isAdmin ? (
          <Button
            className="w-full"
            onClick={() => onEdit?.(pizza)}
          >
            Edit Pizza
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Add to Cart</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add {pizza.name} to Cart</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center space-x-4 py-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleAddToCart}>
                Add to Cart - ${((pizza.price * quantity) / 100).toFixed(2)}
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
