import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

interface UpsellDrinksProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export function UpsellDrinks({ isOpen, onClose, onProceed }: UpsellDrinksProps) {
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = useState<"small" | "large" | null>(null);

  const handleAddDrink = () => {
    if (selectedSize) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          pizzaId: selectedSize === "small" ? 901 : 902, // IDs for drinks
          pizza: {
            id: selectedSize === "small" ? 901 : 902,
            name: selectedSize === "small" ? "שתייה קלה קטנה" : "שתייה קלה גדולה",
            description: "שתייה קלה לבחירה",
            price: selectedSize === "small" ? 800 : 1200, // 8₪ for small, 12₪ for large
            imageUrl: "",
            available: true,
            categoryId: 8, // קטגוריה של משקאות
            allowsToppings: false,
            allowsSizes: false,
            allowsSauces: false,
            isCustomizable: false,
          },
          size: "M",
          quantity: 1,
          toppingLayout: {
            layout: "full",
            sections: [[]],
          },
        },
      });
    }
    onProceed();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">רוצים להוסיף שתייה?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedSize === "small" ? "default" : "outline"}
              onClick={() => setSelectedSize("small")}
              className="h-24 text-lg"
            >
              <div className="space-y-2">
                <div>שתייה קלה קטנה</div>
                <div className="text-sm">₪8</div>
              </div>
            </Button>
            <Button
              variant={selectedSize === "large" ? "default" : "outline"}
              onClick={() => setSelectedSize("large")}
              className="h-24 text-lg"
            >
              <div className="space-y-2">
                <div>שתייה קלה גדולה</div>
                <div className="text-sm">₪12</div>
              </div>
            </Button>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onProceed()}
            >
              לא תודה
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddDrink}
              disabled={!selectedSize}
            >
              הוסף שתייה
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
