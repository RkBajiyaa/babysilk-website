import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Lock, Package, DollarSign, Clock, Eye, ChevronLeft, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ORDER_STATUSES } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AdminOrder {
  id: number;
  orderId: string;
  customerName: string;
  phone: string;
  email: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  upiTransactionId: string | null;
  notes: string | null;
  createdAt: string;
  items?: { productName: string; size: string; quantity: number; price: number }[];
}

const statusLabels: Record<string, string> = {
  order_placed: "Order Placed",
  payment_verification_pending: "Payment Verification Pending",
  payment_received: "Payment Received",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery<AdminOrder[]>({
    queryKey: ["/api/admin/orders"],
    enabled: authenticated,
  });

  const { data: stats } = useQuery<{ totalOrders: number; pendingPayments: number; todayOrders: number; totalRevenue: number }>({
    queryKey: ["/api/admin/stats"],
    enabled: authenticated,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ orderId, status, notes }: { orderId: string; status: string; notes: string }) => {
      return apiRequest("PATCH", `/api/admin/orders/${orderId}`, { orderStatus: status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Order updated successfully" });
      setSelectedOrder(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest("POST", "/api/admin/login", { password });
      setAuthenticated(true);
    } catch {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16" data-testid="page-admin-login">
        <div className="bg-white rounded-lg p-8 border border-gold/10 text-center">
          <Lock size={40} className="mx-auto text-maroon mb-4" />
          <h1 className="font-heading text-xl font-bold text-maroon mb-6">Admin Panel</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="text-base text-center"
              data-testid="input-admin-password"
            />
            <Button type="submit" className="w-full bg-maroon text-cream-DEFAULT" data-testid="button-admin-login">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6" data-testid="page-admin-order-detail">
        <button
          onClick={() => setSelectedOrder(null)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4"
          data-testid="button-back-orders"
        >
          <ChevronLeft size={16} /> Back to Orders
        </button>

        <h2 className="font-heading text-xl font-bold text-maroon mb-4">
          Order: {selectedOrder.orderId}
        </h2>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-5 border border-gold/10">
            <h3 className="font-heading text-sm font-semibold mb-3">Customer Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Name:</span> <strong>{selectedOrder.customerName}</strong></div>
              <div><span className="text-muted-foreground">Phone:</span> <strong>{selectedOrder.phone}</strong></div>
              <div><span className="text-muted-foreground">Email:</span> <strong>{selectedOrder.email || "N/A"}</strong></div>
              <div><span className="text-muted-foreground">City:</span> <strong>{selectedOrder.city}, {selectedOrder.state}</strong></div>
              <div className="col-span-2"><span className="text-muted-foreground">Address:</span> <strong>{selectedOrder.addressLine1}{selectedOrder.addressLine2 ? `, ${selectedOrder.addressLine2}` : ""}, {selectedOrder.pincode}</strong></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gold/10">
            <h3 className="font-heading text-sm font-semibold mb-3">Payment Info</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Total:</span> <strong className="text-maroon">Rs.{selectedOrder.totalAmount.toLocaleString("en-IN")}</strong></div>
              <div><span className="text-muted-foreground">Payment Status:</span> <strong>{selectedOrder.paymentStatus}</strong></div>
              <div><span className="text-muted-foreground">UTR/Txn ID:</span> <strong>{selectedOrder.upiTransactionId || "Not provided"}</strong></div>
              <div><span className="text-muted-foreground">Date:</span> <strong>{new Date(selectedOrder.createdAt).toLocaleDateString("en-IN")}</strong></div>
            </div>
          </div>

          {selectedOrder.items && selectedOrder.items.length > 0 && (
            <div className="bg-white rounded-lg p-5 border border-gold/10">
              <h3 className="font-heading text-sm font-semibold mb-3">Items Ordered</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-gold/5 pb-2">
                    <span>{item.productName} ({item.size}) x{item.quantity}</span>
                    <span className="font-medium">Rs.{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-5 border border-gold/10">
            <h3 className="font-heading text-sm font-semibold mb-3">Update Order</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Order Status</Label>
                <Select value={editStatus || selectedOrder.orderStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="mt-1" data-testid="select-admin-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{statusLabels[status] || status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Notes</Label>
                <Textarea
                  value={editNotes || selectedOrder.notes || ""}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="mt-1"
                  placeholder="Add delivery notes..."
                  data-testid="textarea-admin-notes"
                />
              </div>
              <Button
                onClick={() => updateMutation.mutate({
                  orderId: selectedOrder.orderId,
                  status: editStatus || selectedOrder.orderStatus,
                  notes: editNotes || selectedOrder.notes || "",
                })}
                className="bg-maroon text-cream-DEFAULT"
                disabled={updateMutation.isPending}
                data-testid="button-admin-save"
              >
                <Save size={16} className="mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Status"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" data-testid="page-admin-dashboard">
      <h1 className="font-heading text-2xl font-bold text-maroon mb-6">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6" data-testid="admin-stats">
          {[
            { label: "Total Orders", value: stats.totalOrders, icon: Package, color: "text-maroon" },
            { label: "Pending Payments", value: stats.pendingPayments, icon: Clock, color: "text-gold-dark" },
            { label: "Orders Today", value: stats.todayOrders, icon: Package, color: "text-teal" },
            { label: "Total Revenue", value: `Rs.${stats.totalRevenue.toLocaleString("en-IN")}`, icon: DollarSign, color: "text-green-600" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg p-4 border border-gold/10" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
              <stat.icon size={20} className={`${stat.color} mb-2`} />
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gold/10" data-testid="admin-orders-table">
        <div className="p-4 border-b border-gold/10">
          <h2 className="font-heading text-base font-semibold">All Orders</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t border-gold/5" data-testid={`row-order-${order.orderId}`}>
                    <td className="py-3 px-4 font-mono text-maroon font-medium">{order.orderId}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">{order.phone}</td>
                    <td className="py-3 px-4 font-semibold">Rs.{order.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                        order.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-gold/20 text-gold-dark"
                      }`}>
                        {statusLabels[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setEditStatus(order.orderStatus);
                          setEditNotes(order.notes || "");
                        }}
                        className="text-teal"
                        data-testid={`button-view-order-${order.orderId}`}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
