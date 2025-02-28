import { Pizza, PizzaSize, pizzaSizes, ToppingLayout, DoughType } from "@shared/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Topping } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {CartItem} from "@/types/cart";


interface PizzaCardProps {
  pizza: Pizza;
  isAdmin?: boolean;
  onEdit?: (pizza: Pizza) => void;
  defaultSize?: PizzaSize;
  existingItem?: CartItem;
  onUpdate?: (updatedItem: CartItem) => void;
}

const CREAM_SAUCE_PRICE = 500; 

export function PizzaCard({ 
  pizza, 
  isAdmin, 
  onEdit, 
  defaultSize = "M",
  existingItem,
  onUpdate 
}: PizzaCardProps) {
  const { dispatch } = useCart();
  const [size] = useState<PizzaSize>(existingItem?.size || defaultSize);
  const [quantity, setQuantity] = useState(existingItem?.quantity || 1);
  const [doughType, setDoughType] = useState<DoughType>(existingItem?.doughType || "thick");
  const [selectedPizzas, setSelectedPizzas] = useState<Array<{
    layout: ToppingLayout;
    sections: number[][];
    isCreamSauce: boolean;
    isVeganCheese: boolean;
    doughType: DoughType;
  }>>(existingItem ? [{
    layout: existingItem.toppingLayout.layout,
    sections: existingItem.toppingLayout.sections,
    isCreamSauce: existingItem.isCreamSauce || false,
    isVeganCheese: existingItem.isVeganCheese || false,
    doughType: existingItem.doughType || "thick",
  }] : [{
    layout: "full",
    sections: [[]],
    isCreamSauce: false,
    isVeganCheese: false,
    doughType: "thick",
  }]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPizzaIndex, setCurrentPizzaIndex] = useState(0);

  const { data: toppings } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  const updatePizzaQuantity = (newQuantity: number) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);

    setSelectedPizzas(prev => {
      if (validQuantity > prev.length) {
        return [...prev, ...Array(validQuantity - prev.length).fill({
          layout: "full",
          sections: [[]],
          isCreamSauce: false,
          isVeganCheese: false,
          doughType: "thick",
        })];
      }
      return prev.slice(0, validQuantity);
    });
  };

  const handleToppingToggle = (sectionIndex: number, toppingId: number) => {
    setSelectedPizzas(pizzas => {
      const newPizzas = [...pizzas];
      const currentPizza = { ...newPizzas[currentPizzaIndex] };
      const sections = [...currentPizza.sections];
      const section = sections[sectionIndex] || [];

      if (section.includes(toppingId)) {
        sections[sectionIndex] = section.filter(id => id !== toppingId);
      } else if (section.length < 3) {
        sections[sectionIndex] = [...section, toppingId];
      }

      currentPizza.sections = sections;
      newPizzas[currentPizzaIndex] = currentPizza;
      return newPizzas;
    });
  };

  const updatePizzaLayout = (pizzaIndex: number, layout: ToppingLayout) => {
    setSelectedPizzas(pizzas => {
      const newPizzas = [...pizzas];
      const sections = Array(layout === "full" ? 1 : layout === "half" ? 2 : 4).fill([]);
      newPizzas[pizzaIndex] = {
        ...newPizzas[pizzaIndex],
        layout,
        sections,
      };
      return newPizzas;
    });
  };

  const updatePizzaSauce = (pizzaIndex: number, isCreamSauce: boolean) => {
    setSelectedPizzas(pizzas => {
      const newPizzas = [...pizzas];
      newPizzas[pizzaIndex] = {
        ...newPizzas[pizzaIndex],
        isCreamSauce,
      };
      return newPizzas;
    });
  };

  const updatePizzaCheese = (pizzaIndex: number, isVeganCheese: boolean) => {
    setSelectedPizzas(pizzas => {
      const newPizzas = [...pizzas];
      newPizzas[pizzaIndex] = {
        ...newPizzas[pizzaIndex],
        isVeganCheese,
      };
      return newPizzas;
    });
  };

  const calculatePizzaPrice = (pizzaConfig: typeof selectedPizzas[0]) => {
    const basePrice = pizza.price;
    const saucePrice = pizzaConfig.isCreamSauce ? CREAM_SAUCE_PRICE : 0;
    const toppingsPrice = pizzaConfig.sections.flat().reduce((total, toppingId) => {
      const topping = toppings?.find(t => t.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    return basePrice + saucePrice + toppingsPrice;
  };

  const calculateTotalPrice = () => {
    return selectedPizzas.reduce((total, pizzaConfig) => {
      return total + calculatePizzaPrice(pizzaConfig);
    }, 0);
  };

  const handleAddToCart = () => {
    if (existingItem && onUpdate) {
      onUpdate({
        ...existingItem,
        quantity: quantity,
        size: size,
        toppingLayout: {
          layout: selectedPizzas[0].layout,
          sections: selectedPizzas[0].sections
        },
        doughType: selectedPizzas[0].doughType,
        isCreamSauce: selectedPizzas[0].isCreamSauce,
        isVeganCheese: selectedPizzas[0].isVeganCheese,
      });
    } else {
      selectedPizzas.forEach((pizzaConfig) => {
        dispatch({
          type: "ADD_ITEM",
          payload: {
            pizzaId: pizza.id,
            pizza,
            size,
            quantity: quantity,
            toppingLayout: {
              layout: pizzaConfig.layout,
              sections: pizzaConfig.sections
            },
            doughType: pizzaConfig.doughType,
            isCreamSauce: pizzaConfig.isCreamSauce,
            isVeganCheese: pizzaConfig.isVeganCheese,
          },
        });
      });
    }
    setIsDialogOpen(false);
    setQuantity(1);
    setSelectedPizzas([{
      layout: "full",
      sections: [[]],
      isCreamSauce: false,
      isVeganCheese: false,
      doughType: "thick",
    }]);
    setCurrentPizzaIndex(0);
  };

  const updatePizzaDoughType = (pizzaIndex: number, doughType: DoughType) => {
    setSelectedPizzas(pizzas => {
      const newPizzas = [...pizzas];
      newPizzas[pizzaIndex] = {
        ...newPizzas[pizzaIndex],
        doughType,
      };
      return newPizzas;
    });
  };

  const currentPizza = selectedPizzas[currentPizzaIndex];
  const sections = currentPizza.layout === "full" ? 1 : currentPizza.layout === "half" ? 2 : 4;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-center">
          <span>{pizza.name}</span>
          <span className="text-lg">
            ₪{(pizza.price / 100).toFixed(2)}
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
        <p className="text-sm text-muted-foreground text-center">{pizza.description}</p>
      </CardContent>
      <CardFooter>
        {isAdmin ? (
          <Button
            className="w-full"
            onClick={() => onEdit?.(pizza)}
          >
            ערוך פיצה
          </Button>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">בחר</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto my-8">
              <DialogHeader>
                <DialogTitle className="text-center">התאם את {pizza.name} לטעמך</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* כמות מגשים */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updatePizzaQuantity(quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updatePizzaQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Label>כמות מגשים</Label>
                </div>

                {/* סוג בצק */}
                <div className="flex items-center justify-between">
                  <Switch
                    id={`thin-dough-${currentPizzaIndex}`}
                    checked={selectedPizzas[currentPizzaIndex].doughType === "thin"}
                    onCheckedChange={(checked) => updatePizzaDoughType(currentPizzaIndex, checked ? "thin" : "thick")}
                  />
                  <Label htmlFor={`thin-dough-${currentPizzaIndex}`}>בצק דק</Label>
                </div>

                <Tabs value={currentPizzaIndex.toString()} onValueChange={(value) => setCurrentPizzaIndex(parseInt(value))}>
                  <TabsList className="w-full flex-row-reverse">
                    {selectedPizzas.map((_, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        מגש {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {selectedPizzas.map((pizzaConfig, pizzaIndex) => (
                    <TabsContent key={pizzaIndex} value={pizzaIndex.toString()}>
                      <div className="space-y-4 mb-4">
                        <div className="flex items-center justify-between">
                          <Switch
                            id={`cream-sauce-${pizzaIndex}`}
                            checked={pizzaConfig.isCreamSauce}
                            onCheckedChange={(checked) => updatePizzaSauce(pizzaIndex, checked)}
                          />
                          <Label htmlFor={`cream-sauce-${pizzaIndex}`}>רוטב שמנת (+ ₪5)</Label>
                        </div>
                        <div className="flex items-center justify-between">
                          <Switch
                            id={`vegan-cheese-${pizzaIndex}`}
                            checked={pizzaConfig.isVeganCheese}
                            onCheckedChange={(checked) => updatePizzaCheese(pizzaIndex, checked)}
                          />
                          <Label htmlFor={`vegan-cheese-${pizzaIndex}`}>גבינה טבעונית</Label>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="text-sm font-medium mb-2 block text-right">בחר פריסת תוספות</label>
                        <Select
                          value={pizzaConfig.layout}
                          onValueChange={(value: ToppingLayout) => updatePizzaLayout(pizzaIndex, value)}
                        >
                          <SelectTrigger className="text-right">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="full" className="text-right">על כל הפיצה</SelectItem>
                            <SelectItem value="half" className="text-right">חצי-חצי</SelectItem>
                            <SelectItem value="quarter" className="text-right">רבעים</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Tabs defaultValue="0" className="w-full">
                        <TabsList className="w-full flex-row-reverse">
                          {Array.from({ length: sections }, (_, i) => (
                            <TabsTrigger key={i} value={i.toString()}>
                              {pizzaConfig.layout === "full" ? "תוספות" :
                                pizzaConfig.layout === "half" ? `חצי ${i + 1}` :
                                `רבע ${i + 1}`}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {Array.from({ length: sections }, (_, sectionIndex) => (
                          <TabsContent key={sectionIndex} value={sectionIndex.toString()}>
                            <div className="grid grid-cols-2 gap-2">
                              {toppings?.map(topping => {
                                const isSelected = pizzaConfig.sections[sectionIndex]?.includes(topping.id);
                                const canSelect = !isSelected && (!pizzaConfig.sections[sectionIndex] || pizzaConfig.sections[sectionIndex].length < 3);

                                return (
                                  <Button
                                    key={topping.id}
                                    variant={isSelected ? "secondary" : "outline"}
                                    className="justify-end"
                                    onClick={() => handleToppingToggle(sectionIndex, topping.id)}
                                    disabled={!isSelected && !canSelect}
                                  >
                                    {topping.name} (₪{(topping.price / 100).toFixed(2)})
                                    {isSelected && <CheckCircle2 className="w-4 h-4 ml-2" />}
                                  </Button>
                                );
                              })}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>

                      <div className="mt-4 p-4 border rounded-lg">
                        <div className="flex justify-between text-lg">
                          <span>₪{(calculatePizzaPrice(pizzaConfig) / 100).toFixed(2)}</span>
                          <span>:מחיר למגש</span>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <div className="mt-4 p-4 border rounded-lg">
                <div className="flex justify-between text-lg font-bold">
                  <span>₪{(calculateTotalPrice() / 100).toFixed(2)}</span>
                  <span>:סה"כ לתשלום</span>
                </div>
              </div>

              <Button onClick={handleAddToCart} className="w-full mt-4">
                {existingItem ? "עדכן פריט" : "הוסף לסל"}
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}