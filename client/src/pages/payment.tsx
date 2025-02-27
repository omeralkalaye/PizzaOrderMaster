import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/lib/cart";

const creditCardSchema = z.object({
  cardNumber: z.string()
    .min(16, "מספר כרטיס אשראי לא תקין")
    .max(16, "מספר כרטיס אשראי לא תקין")
    .regex(/^\d+$/, "מספר כרטיס אשראי חייב להכיל ספרות בלבד"),
  expiryMonth: z.string()
    .min(2, "חודש לא תקין")
    .max(2, "חודש לא תקין")
    .regex(/^\d+$/, "חודש חייב להכיל ספרות בלבד")
    .refine(val => parseInt(val) >= 1 && parseInt(val) <= 12, "חודש לא תקין"),
  expiryYear: z.string()
    .min(2, "שנה לא תקינה")
    .max(2, "שנה לא תקינה")
    .regex(/^\d+$/, "שנה חייבת להכיל ספרות בלבד"),
  cvv: z.string()
    .min(3, "קוד אבטחה לא תקין")
    .max(4, "קוד אבטחה לא תקין")
    .regex(/^\d+$/, "קוד אבטחה חייב להכיל ספרות בלבד"),
  idNumber: z.string()
    .min(9, "מספר ת.ז. לא תקין")
    .max(9, "מספר ת.ז. לא תקין")
    .regex(/^\d+$/, "מספר ת.ז. חייב להכיל ספרות בלבד"),
});

type CreditCardFormData = z.infer<typeof creditCardSchema>;

export default function Payment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { dispatch } = useCart();
  const orderData = history.state?.orderData;

  const form = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      idNumber: "",
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data: CreditCardFormData) => {
      // בשלב זה נדמה תשלום מוצלח
      // בהמשך כאן יהיה חיבור לשירות סליקה אמיתי
      const simulatePayment = () => new Promise(resolve => setTimeout(resolve, 1500));
      await simulatePayment();
      
      // לאחר תשלום מוצלח, שולחים את פרטי ההזמנה לשרת
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
        title: "שגיאה בביצוע התשלום",
        description: "נא לנסות שוב מאוחר יותר.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreditCardFormData) => {
    if (!orderData) {
      toast({
        title: "שגיאה",
        description: "לא נמצאו פרטי הזמנה",
        variant: "destructive",
      });
      setLocation("/cart");
      return;
    }
    orderMutation.mutate(data);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">פרטי תשלום</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מספר כרטיס אשראי</FormLabel>
                <FormControl>
                  <Input {...field} type="text" maxLength={16} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>חודש תפוגה</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" maxLength={2} placeholder="MM" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שנת תפוגה</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" maxLength={2} placeholder="YY" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>קוד אבטחה (CVV)</FormLabel>
                <FormControl>
                  <Input {...field} type="text" maxLength={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מספר ת.ז.</FormLabel>
                <FormControl>
                  <Input {...field} type="text" maxLength={9} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={orderMutation.isPending}
          >
            {orderMutation.isPending ? "מבצע תשלום..." : "בצע הזמנה"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
