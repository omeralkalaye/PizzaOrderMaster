import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Order, OrderStatus } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "ממתין",
  preparing: "בהכנה",
  ready: "מוכן",
  delivered: "נמסר",
};

export default function Orders() {
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) => {
      return apiRequest("PATCH", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "סטטוס ההזמנה עודכן",
      });
    },
    onError: () => {
      toast({
        title: "שגיאה בעדכון סטטוס ההזמנה",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">הזמנות</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">הזמנות</h1>
      <div className="space-y-4">
        {orders?.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>הזמנה מס׳ {order.id}</span>
                <Select
                  value={order.status}
                  onValueChange={(value: OrderStatus) =>
                    updateStatusMutation.mutate({ id: order.id, status: value })
                  }
                >
                  <SelectTrigger className={`w-[200px] ${ORDER_STATUS_COLORS[order.status as OrderStatus]}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">ממתין</SelectItem>
                    <SelectItem value="preparing">בהכנה</SelectItem>
                    <SelectItem value="ready">מוכן</SelectItem>
                    <SelectItem value="delivered">נמסר</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">פרטי לקוח</h3>
                  <p>{order.customerName}</p>
                  <p>{order.phone}</p>
                  <p>{order.address}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">פרטי הזמנה</h3>
                  <p>סה"כ: ₪{(order.total / 100).toFixed(2)}</p>
                  <p>תאריך: {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</p>
                  <div className="mt-2">
                    {(order.items as any[]).map((item, index) => (
                      <p key={index}>
                        {item.quantity}x פיצה מס׳ {item.pizzaId}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}