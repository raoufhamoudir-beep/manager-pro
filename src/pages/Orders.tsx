import { useAddOrder } from "@/features/orders/hooks/useOrdersManagements";
import { useStock } from "@/features/Stock/hooks/useStock";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { 
  ArrowRight, 
  Package, 
  ShoppingBag, 
  RotateCcw, 
  TrendingDown, 
  TrendingUp,
  Calendar,
  DollarSign,
  Search,
  Filter,
  X
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Orders = () => {
  const { data: stock, isLoading: stockLoading } = useStock();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { mutate: addorder, isPending } = useAddOrder();
  
  const [selectedProduct, setSelectedProduct] = useState("");
  const [outQty, setOutQty] = useState("");
  const [inQty, setInQty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "Income" | "Expenses">("all");

  const handleReturnProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !inQty) {
      toast.error("الرجاء اختيار المنتج وإدخال الكمية");
      return;
    }

    const quantity = Number(inQty);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("الرجاء إدخال كمية صحيحة");
      return;
    }

    const product = stock?.find((e) => e._id === selectedProduct);
    if (!product) {
      toast.error("المنتج غير موجود");
      return;
    }

    addorder({
      log: {
        Classification: "إرجاع للمخزون",
        description: `إرجاع ${quantity} من ${product.name}`,
        productId: product._id || "",
        type: "Income",
        value: product.price * quantity,
      },
      newquality: product.quantity + quantity,
    }, {
      onSuccess: () => {
        setInQty("");
        setSelectedProduct("");
      }
    });
  };

  const handleSendProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !outQty) {
      toast.error("الرجاء اختيار المنتج وإدخال الكمية");
      return;
    }

    const quantity = Number(outQty);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("الرجاء إدخال كمية صحيحة");
      return;
    }

    const product = stock?.find((e) => e._id === selectedProduct);
    if (!product) {
      toast.error("المنتج غير موجود");
      return;
    }

    if (quantity > product.quantity) {
      toast.error(`الكمية المتاحة فقط ${product.quantity}`);
      return;
    }

    addorder({
      log: {
        Classification: "إرسال طلبية",
        description: `إرسال ${quantity} من ${product.name}`,
        productId: product._id || "",
        type: "Expenses",
        value: product.price * quantity,
      },
      newquality: product.quantity - quantity,
    }, {
      onSuccess: () => {
        setOutQty("");
        setSelectedProduct("");
      }
    });
  };

  if (stockLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-bold text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 p-6 max-w-[1400px] mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">إجمالي السلع</p>
              <p className="text-4xl font-black mt-2">{stock?.length || 0}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Package size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">قيمة المخزون</p>
              <p className="text-4xl font-black mt-2">
                {stock?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0).toLocaleString() || 0}
                <span className="text-lg mr-2">دج</span>
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <DollarSign size={32} />
            </div>
          </div>
        </div>

        {/* <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">إجمالي الإرجاع</p>
              <p className="text-4xl font-black mt-2">
                {totalIncome.toLocaleString()}
                <span className="text-lg mr-2">دج</span>
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <TrendingUp size={32} />
            </div>
          </div>
        </div> */}

        {/* <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">إجمالي الإرسال</p>
              <p className="text-4xl font-black mt-2">
                {totalExpenses.toLocaleString()}
                <span className="text-lg mr-2">دج</span>
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <TrendingDown size={32} />
            </div>
          </div>
        </div> */}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Order Card */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-100">
          <div className="flex items-center gap-4 text-rose-600 mb-6">
            <div className="bg-rose-100 p-3 rounded-2xl">
              <ShoppingBag size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black">إرسال طلبية</h3>
          </div>
          
          <form onSubmit={handleSendProduct} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 mr-1">اسم السلعة *</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-semibold focus:border-rose-400 focus:bg-white transition-all"
                required
              >
                <option value="">اختر منتج</option>
                {stock?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - متوفر: {p.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 mr-1">الكمية *</label>
              <input
                type="number"
                value={outQty}
                onChange={(e) => setOutQty(e.target.value)}
                placeholder="0"
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-semibold focus:border-rose-400 focus:bg-white transition-all"
                required
                min="1"
              />
            </div>

            {selectedProduct && outQty && (
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                <p className="text-sm text-slate-600">
                  <span className="font-bold">القيمة الإجمالية:</span>{" "}
                  <span className="text-rose-600 font-black text-lg">
                    {(stock?.find(p => p._id === selectedProduct)?.price || 0) * Number(outQty)} دج
                  </span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-rose-600 text-white font-bold rounded-xl shadow-lg hover:bg-rose-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <ArrowRight size={20} />
                  تأكيد الإرسال
                </>
              )}
            </button>
          </form>
        </div>

        {/* Return Order Card */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-100">
          <div className="flex items-center gap-4 text-emerald-600 mb-6">
            <div className="bg-emerald-100 p-3 rounded-2xl">
              <RotateCcw size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black">إرجاع للمخزون</h3>
          </div>
          
          <form onSubmit={handleReturnProduct} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 mr-1">اسم السلعة *</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-semibold focus:border-emerald-400 focus:bg-white transition-all"
                required
              >
                <option value="">اختر منتج</option>
                {stock?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - متوفر: {p.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 mr-1">الكمية *</label>
              <input
                type="number"
                value={inQty}
                onChange={(e) => setInQty(e.target.value)}
                placeholder="0"
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-semibold focus:border-emerald-400 focus:bg-white transition-all"
                required
                min="1"
              />
            </div>

            {selectedProduct && inQty && (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <p className="text-sm text-slate-600">
                  <span className="font-bold">القيمة الإجمالية:</span>{" "}
                  <span className="text-emerald-600 font-black text-lg">
                    {(stock?.find(p => p._id === selectedProduct)?.price || 0) * Number(inQty)} دج
                  </span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <RotateCcw size={20} />
                  تأكيد الإرجاع
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Orders History */}
     
    </div>
  );
};

export default Orders;