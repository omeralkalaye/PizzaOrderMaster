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

const orderSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Delivery address is required"),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function Cart() {
  const { state: { items }, dispatch } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
        })),
        status: "pending",
        total: calculateTotal(items),
      };
      
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "We'll start preparing your pizza right away.",
      });
      dispatch({ type: "CLEAR" });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Failed to place order",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrderFormData) => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart first.",
        variant: "destructive",
      });
      return;
    }
    orderMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => setLocation("/menu")}>Browse Menu</Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.pizzaId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{item.pizza.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${((item.pizza.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch({
                        type: "UPDATE_QUANTITY",
                        payload: { pizzaId: item.pizzaId, quantity: Math.max(1, item.quantity - 1) }
                      })}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch({
                        type: "UPDATE_QUANTITY",
                        payload: { pizzaId: item.pizzaId, quantity: item.quantity + 1 }
                      })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.pizzaId })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 border rounded-lg">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${(calculateTotal(items) / 100).toFixed(2)}</span>
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
                      <FormLabel>Name</FormLabel>
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
                      <FormLabel>Phone</FormLabel>
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
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={orderMutation.isPending}>
                  {orderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
