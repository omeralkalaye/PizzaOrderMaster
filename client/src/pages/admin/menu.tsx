import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Pizza, insertPizzaSchema } from "@shared/schema";
import { PizzaCard } from "@/components/pizza-card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
  "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
  "https://images.unsplash.com/photo-1571066811602-716837d681de",
  "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  "https://images.unsplash.com/photo-1552539618-7eec9b4d1796",
];

export default function AdminMenu() {
  const { toast } = useToast();
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: pizzas, isLoading } = useQuery<Pizza[]>({
    queryKey: ["/api/pizzas"],
  });

  const form = useForm({
    resolver: zodResolver(insertPizzaSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: DEFAULT_IMAGES[0],
      available: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/pizzas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pizzas"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "הפיצה נוספה בהצלחה" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PATCH", `/api/pizzas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pizzas"] });
      setIsDialogOpen(false);
      setEditingPizza(null);
      form.reset();
      toast({ title: "הפיצה עודכנה בהצלחה" });
    },
  });

  const onSubmit = (data: any) => {
    // Convert price from dollars to cents
    const formData = {
      ...data,
      price: Math.round(parseFloat(data.price) * 100),
    };

    if (editingPizza) {
      updateMutation.mutate({ id: editingPizza.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (pizza: Pizza) => {
    setEditingPizza(pizza);
    form.reset({
      name: pizza.name,
      description: pizza.description,
      price: pizza.price / 100, // Convert cents to dollars for display
      imageUrl: pizza.imageUrl,
      available: pizza.available,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ניהול תפריט</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ניהול תפריט</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPizza(null);
              form.reset();
            }}>
              הוסף פיצה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingPizza ? "עריכת פיצה" : "הוספת פיצה חדשה"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תיאור</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>מחיר (₪)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תמונה</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEFAULT_IMAGES.map((url) => (
                              <SelectItem key={url} value={url}>
                                תמונת פיצה {DEFAULT_IMAGES.indexOf(url) + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>זמין</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {editingPizza ? "עדכן פיצה" : "הוסף פיצה"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas?.map((pizza) => (
          <PizzaCard
            key={pizza.id}
            pizza={pizza}
            isAdmin
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}