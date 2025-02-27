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
import { PizzaCard, CartItem } from "@/components/pizza-card";


const orderSchema = z.object({
  customerName: z.string().min(2, "נא להזין שם מלא"),
  phone: z.string().min(10, "נא להזין מספר טלפון תקין"),
  address: z.string().min(5, "נא להזין כתובת מלאה למשלוח"),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function Cart() {
  const { state: { items }, dispatch } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      const orderData = {
        ...data,
        items: items.map(item => ({
          pizzaId: item.pizzaId,
          quantity: item.quantity,
          size: item.size,
          toppingLayout: item.toppingLayout,
          isCreamSauce: item.isCreamSauce,
          isVeganCheese: item.isVeganCheese,
        })),
        status: "pending",
        total: calculateTotal(items),
      };

      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "ההזמנה התקבלה בהצלחה!",
        description: "נתחיל להכין את הפיצה שלך.",
      });
      dispatch({ type: "CLEAR" });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "שגיאה בביצוע ההזמנה",
        description: "נא לנסות שוב מאוחר יותר.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrderFormData) => {
    if (items.length === 0) {
      toast({
        title: "הסל ריק",
        description: "נא להוסיף פריטים לסל לפני ביצוע ההזמנה.",
        variant: "destructive",
      });
      return;
    }
    orderMutation.mutate(data);
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
              {items.map((item) => {
                const toppingsCount = item.toppingLayout.sections.flat().length;
                const hasToppings = toppingsCount > 0;
                const hasSpecialSauce = item.isCreamSauce;
                const hasVeganCheese = item.isVeganCheese;

                return (
                  <div 
                    key={`${item.pizzaId}-${item.size}-${JSON.stringify(item.toppingLayout)}`}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent/5"
                    onClick={() => setEditingItem(item)}
                  >
                    <div>
                      <h3 className="font-medium">{item.pizza.name} - {item.size}</h3>
                      {hasSpecialSauce && (
                        <p className="text-sm text-muted-foreground">רוטב שמנת</p>
                      )}
                      {hasVeganCheese && (
                        <p className="text-sm text-muted-foreground">גבינה טבעונית</p>
                      )}
                      {hasToppings && (
                        <p className="text-sm text-muted-foreground">
                          {toppingsCount} תוספות
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
                );
              })}
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
                <span>סה"כ לתשלום:</span>
                <span>₪{(calculateTotal(items) / 100).toFixed(2)}</span>
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
                <Button type="submit" className="w-full" disabled={orderMutation.isPending}>
                  {orderMutation.isPending ? "מבצע הזמנה..." : "בצע הזמנה"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}