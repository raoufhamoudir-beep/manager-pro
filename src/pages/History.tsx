import { useOrders } from '@/features/orders/hooks/useOrders'
import { Calendar, DollarSign, Package, Search, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const History = () => {
  const { data: orders, isLoading } = useOrders()
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "Income" | "Expenses">("all");

  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.Classification?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || order.type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  // Calculate totals
  const totalIncome = orders?.filter((o: any) => o.type === "Income")
    .reduce((acc: number, item: any) => acc + (item.value || 0), 0) || 0;

  const totalExpenses = orders?.filter((o: any) => o.type === "Expenses")
    .reduce((acc: number, item: any) => acc + (item.value || 0), 0) || 0;

  const incomeCount = orders?.filter((o: any) => o.type === "Income").length || 0;
  const expensesCount = orders?.filter((o: any) => o.type === "Expenses").length || 0;

  if (isLoading) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Operations Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">إجمالي العمليات</p>
              <p className="text-4xl font-black mt-2">{orders?.length || 0}</p>
              <p className="text-indigo-200 text-xs mt-2">
                {incomeCount} إرجاع · {expensesCount} إرسال
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Calendar size={32} />
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">إجمالي الإرجاع</p>
              <p className="text-4xl font-black mt-2">
                {totalIncome.toLocaleString()}
                <span className="text-lg mr-2">دج</span>
              </p>
              <p className="text-emerald-200 text-xs mt-2">
                {incomeCount} عملية
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <TrendingUp size={32} />
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">إجمالي الإرسال</p>
              <p className="text-4xl font-black mt-2">
                {totalExpenses.toLocaleString()}
                <span className="text-lg mr-2">دج</span>
              </p>
              <p className="text-rose-200 text-xs mt-2">
                {expensesCount} عملية
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <TrendingDown size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Net Balance Card (Optional) */}
      <div className={`p-6 rounded-3xl text-white shadow-lg ${
        totalIncome >= totalExpenses 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
          : 'bg-gradient-to-br from-amber-500 to-amber-600'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${
              totalIncome >= totalExpenses ? 'text-blue-100' : 'text-amber-100'
            }`}>
              الفرق
            </p>
            <p className="text-4xl font-black mt-2">
              {Math.abs(totalIncome - totalExpenses).toLocaleString()}
              <span className="text-lg mr-2">دج</span>
            </p>
            <p className={`text-xs mt-2 ${
              totalIncome >= totalExpenses ? 'text-blue-200' : 'text-amber-200'
            }`}>
              {totalIncome >= totalExpenses 
                ? '↑ الإرجاع أكبر من الإرسال' 
                : '↓ الإرسال أكبر من الإرجاع'}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl">
            <DollarSign size={32} />
          </div>
        </div>
      </div>

      {/* Orders History Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-lg">
        <div className="p-6 border-b-2 border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-3">
                <Calendar size={24} />
                سجل العمليات
              </h3>
              <p className="text-sm text-slate-500 mt-1">إجمالي {filteredOrders.length} عملية</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث في السجل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-indigo-400 transition-all"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filterType === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setFilterType("Income")}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filterType === "Income"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  إرجاع
                </button>
                <button
                  onClick={() => setFilterType("Expenses")}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filterType === "Expenses"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  إرسال
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-slate-300 mb-4" />
            <p className="text-xl font-bold text-slate-400">
              {searchTerm || filterType !== "all" ? 'لا توجد نتائج' : 'لا توجد عمليات بعد'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide">التصنيف</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide">الوصف</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide text-center">النوع</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide text-center">القيمة</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide text-center">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <span className="font-bold text-slate-800">{order.Classification}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-slate-600">{order.description}</span>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm ${order.type === "Income"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                        }`}>
                        {order.type === "Income" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {order.type === "Income" ? "إرجاع" : "إرسال"}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`font-bold tabular-nums ${order.type === "Income" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                        {order.value?.toLocaleString()} دج
                      </span>
                    </td>
                    <td className="p-5 text-center text-slate-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('ar-DZ', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default History