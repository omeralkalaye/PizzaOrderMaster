import { useCart, calculateTotal } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PizzaCard } from "@/components/pizza-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CartItem } from "@/types/cart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const orderSchema = z.object({
  customerName: z.string().min(2, "נא להזין שם מלא"),
  phone: z.string().min(10, "נא להזין מספר טלפון תקין"),
  deliveryType: z.enum(["delivery", "pickup"]),
  address: z.string().optional(),
}).refine(
  (data) => {
    if (data.deliveryType === "delivery") {
      return data.address && data.address.length >= 5;
    }
    return true;
  },
  {
    message: "נא להזין כתובת מלאה למשלוח",
    path: ["address"],
  }
);

type OrderFormData = z.infer<typeof orderSchema>;

const DRINKS = {
  small: [
    { id: "cola_small", name: "קולה", price: 800 },
    { id: "sprite_small", name: "ספרייט", price: 800 },
    { id: "fanta_small", name: "פנטה", price: 800 },
    { id: "fuzetea_small", name: "פיוז טי", price: 800 },
  ],
  large: [
    { id: "cola_large", name: "קולה", price: 1200 },
    { id: "sprite_large", name: "ספרייט", price: 1200 },
    { id: "fanta_large", name: "פנטה", price: 1200 },
    { id: "fuzetea_large", name: "פיוז טי", price: 1200 },
  ],
};

interface DrinkSelection {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: "small" | "large";
}

export default function Cart() {
  const { state: { items }, dispatch } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkSelection[]>([]);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      deliveryType: "delivery",
      address: "",
    },
  });

  const deliveryType = form.watch("deliveryType");

  const calculateDrinksTotal = () => {
    return selectedDrinks.reduce((total, drink) => total + drink.price * drink.quantity, 0);
  };

  const calculateFinalTotal = () => {
    return calculateTotal(items) + calculateDrinksTotal();
  };

  const handleAddDrink = (size: "small" | "large", drinkId: string) => {
    const drinkList = DRINKS[size];
    const selectedDrink = drinkList.find(d => d.id === drinkId);
    if (!selectedDrink) return;

    setSelectedDrinks(prev => [
      ...prev,
      {
        id: drinkId,
        name: selectedDrink.name,
        price: selectedDrink.price,
        quantity: 1,
        size
      }
    ]);
  };

  const handleUpdateDrinkQuantity = (index: number, change: number) => {
    setSelectedDrinks(prev => {
      const updated = [...prev];
      const newQuantity = Math.max(1, updated[index].quantity + change);
      updated[index] = { ...updated[index], quantity: newQuantity };
      return updated;
    });
  };

  const handleRemoveDrink = (index: number) => {
    setSelectedDrinks(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: OrderFormData) => {
    if (items.length === 0) {
      toast({
        title: "הסל ריק",
        description: "נא להוסיף פריטים לסל לפני ביצוע ההזמנה.",
        variant: "destructive",
      });
      return;
    }

    // הוספת השתייה לעגלה
    selectedDrinks.forEach(drink => {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          pizzaId: drink.size === "small" ? 901 : 902,
          pizza: {
            id: drink.size === "small" ? 901 : 902,
            name: `שתייה קלה ${drink.size === "small" ? "קטנה" : "גדולה"} - ${drink.name}`,
            description: "שתייה קלה לבחירה",
            price: drink.price,
            imageUrl: "",
            available: true,
            categoryId: 8,
            allowsToppings: false,
            allowsSizes: false,
            allowsSauces: false,
            isCustomizable: false,
          },
          size: drink.size === "small" ? "S" : "L",
          quantity: drink.quantity,
          toppingLayout: { layout: "full", sections: [[]] },
          doughType: "thick",
        },
      });
    });

    setLocation("/payment");
  };

  const handleUpdateItem = (updatedItem: CartItem) => {
    dispatch({ type: "REMOVE_ITEM", payload: updatedItem.pizzaId });
    dispatch({ type: "ADD_ITEM", payload: updatedItem });
    setEditingItem(null);
    toast({
      title: "הפריט עודכן בהצלחה",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">סל הקניות שלך</h1>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">סל הקניות שלך ריק</p>
          <Button onClick={() => setLocation("/menu")}>עבור לתפריט</Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.pizzaId}-${item.size}-${JSON.stringify(item.toppingLayout)}`}
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent/5"
                  onClick={() => setEditingItem(item)}
                >
                  <div>
                    <h3 className="font-medium">{item.pizza.name} - {item.size}</h3>
                    {item.isCreamSauce && (
                      <p className="text-sm text-muted-foreground">רוטב שמנת</p>
                    )}
                    {item.isVeganCheese && (
                      <p className="text-sm text-muted-foreground">גבינה טבעונית</p>
                    )}
                    {item.toppingLayout.sections.flat().length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {item.toppingLayout.sections.flat().length} תוספות
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      ₪{((item.pizza.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: { pizzaId: item.pizzaId, quantity: Math.max(1, item.quantity - 1) }
                        });
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: { pizzaId: item.pizzaId, quantity: item.quantity + 1 }
                        });
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "REMOVE_ITEM", payload: item.pizzaId });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {editingItem && (
              <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto my-8">
                  <PizzaCard
                    pizza={editingItem.pizza}
                    defaultSize={editingItem.size}
                    existingItem={editingItem}
                    onUpdate={handleUpdateItem}
                  />
                </DialogContent>
              </Dialog>
            )}

            <div className="mt-4 p-4 border rounded-lg">
              <div className="flex justify-between text-lg font-bold">
                <span>₪{(calculateTotal(items) / 100).toFixed(2)}</span>
                <span>:סה"כ לתשלום (ללא שתייה)</span>
              </div>
            </div>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם מלא</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>טלפון</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>אופן קבלת ההזמנה</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col gap-4"
                        >
                          <div className="flex items-center justify-end space-x-reverse space-x-2">
                            <label htmlFor="delivery">משלוח</label>
                            <RadioGroupItem value="delivery" id="delivery" />
                          </div>
                          <div className="flex items-center justify-end space-x-reverse space-x-2">
                            <label htmlFor="pickup">איסוף עצמי</label>
                            <RadioGroupItem value="pickup" id="pickup" />
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {deliveryType === "delivery" && (
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>כתובת למשלוח</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* תפריטי בחירת שתייה */}
                <div className="space-y-4 border-t pt-4">
                  <Label className="block text-right text-lg font-medium">הוסף שתייה להזמנה:</Label>

                  <div className="space-y-4">
                    <div>
                      <Label className="block text-right mb-2">שתייה קלה קטנה - ₪8</Label>
                      <Select onValueChange={(value) => handleAddDrink("small", value)}>
                        <SelectTrigger className="w-full text-right">
                          <SelectValue placeholder="בחר שתייה קטנה" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          {DRINKS.small.map(drink => (
                            <SelectItem key={drink.id} value={drink.id} className="text-right">
                              {drink.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-right mb-2">שתייה קלה גדולה - ₪12</Label>
                      <Select onValueChange={(value) => handleAddDrink("large", value)}>
                        <SelectTrigger className="w-full text-right">
                          <SelectValue placeholder="בחר שתייה גדולה" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          {DRINKS.large.map(drink => (
                            <SelectItem key={drink.id} value={drink.id} className="text-right">
                              {drink.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* רשימת השתייה שנבחרה */}
                    {selectedDrinks.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <Label className="block text-right">שתייה שנבחרה:</Label>
                        <div className="space-y-2">
                          {selectedDrinks.map((drink, index) => (
                            <div key={`${drink.id}-${index}`} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveDrink(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center space-x-2 mx-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleUpdateDrinkQuantity(index, -1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center">{drink.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleUpdateDrinkQuantity(index, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-right">
                                <div>{drink.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {drink.size === "small" ? "קטנה" : "גדולה"} - ₪{(drink.price * drink.quantity / 100).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          סה"כ שתייה: ₪{(calculateDrinksTotal() / 100).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  מעבר לתשלום - ₪{(calculateFinalTotal() / 100).toFixed(2)}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}