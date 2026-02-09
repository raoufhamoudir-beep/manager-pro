import { useStock } from "@/features/Stock/hooks/useStock"
import { useAddStock, useDeleteStock, useUpdateStock } from "@/features/Stock/hooks/useStockManagements";
import type { Stock } from "@/types";
import { AlertCircle, Bell, BellRing, Edit2, Package, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";

const StockComponent = () => {
  const { data: stock, isLoading } = useStock()
  const { mutate: addStock, isPending: adding } = useAddStock()
  const { mutate: updateStock, isPending: updating } = useUpdateStock()
  const { mutate: deleteStock, isPending: deleting } = useDeleteStock()

  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pQty, setPQty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
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
  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditingId(item._id);
    setPName(item.name);
    setPPrice(item.price.toString());
    setPQty(item.quantity.toString());
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId('');
    setPName('');
    setPPrice('');
    setPQty('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pName.trim() || pPrice === '' || pQty === '') {
      return;
    }

    const price = Number(pPrice);
    const quantity = Number(pQty);

    if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
      return;
    }

    const payload = {
      name: pName.trim(),
      price,
      quantity,
    };

    if (isEditing) {
      updateStock({ id: editingId, data: payload });
    } else {
      addStock(payload);
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    deleteStock(id, {
      onSuccess: () => {
        setDeleteConfirm(null);
      }
    });
  };

  const filteredStock = stock?.filter((s: any) => 
    s?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const lowStockCount = stock?.filter((s: any) => s.quantity <= 5).length || 0;

 

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 p-6 max-w-[1400px] mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {stock?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0).toLocaleString() || 0} دج
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Package size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">تحذيرات المخزون</p>
              <p className="text-4xl font-black mt-2">{lowStockCount}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <BellRing size={32} className={lowStockCount > 0 ? "animate-bounce" : ""} />
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-lg space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            {isEditing ? (
              <>
                <Edit2 className="text-indigo-600" size={28} />
                تحديث السلعة
              </>
            ) : (
              <>
                <Plus className="text-indigo-600" size={28} />
                إضافة سلعة جديدة
              </>
            )}
          </h2>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={24} className="text-slate-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 mr-1">اسم السلعة *</label>
            <input
              type="text"
              placeholder="أدخل اسم السلعة"
              value={pName}
              onChange={e => setPName(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-semibold focus:border-indigo-400 focus:bg-white transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 mr-1">سعر البيع (دج) *</label>
            <input
              type="number"
              placeholder="0.00"
              value={pPrice}
              onChange={e => setPPrice(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-semibold focus:border-indigo-400 focus:bg-white transition-all"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 mr-1">الكمية *</label>
            <input
              type="number"
              placeholder="0"
              value={pQty}
              onChange={e => setPQty(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-semibold focus:border-indigo-400 focus:bg-white transition-all"
              required
              min="0"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={adding || updating}
            className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {adding || updating ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري المعالجة...
              </>
            ) : (
              <>
                {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                {isEditing ? 'تحديث السلعة' : 'إضافة السلعة'}
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-lg">
        <div className="p-6 border-b-2 border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-black text-slate-800 text-xl">قائمة المخزون</h3>
            <p className="text-sm text-slate-500 mt-1">إجمالي {filteredStock.length} سلعة</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن سلعة..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {filteredStock.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-slate-300 mb-4" />
            <p className="text-xl font-bold text-slate-400">
              {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد سلع في المخزون'}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              {searchTerm ? 'جرب كلمات بحث أخرى' : 'ابدأ بإضافة سلعة جديدة'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide">المنتج</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide text-center">السعر</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide text-center">الكمية</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide text-center">القيمة الإجمالية</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide text-center">الحالة</th>
                  <th className="p-5 text-xs font-black text-slate-600 uppercase tracking-wide text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStock.map((item: Stock) => {
                  const isLow = item.quantity <= 5;
                  const totalValue = item.price * item.quantity;
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Package className="text-indigo-600" size={20} />
                          </div>
                          <span className="font-bold text-slate-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <span className="font-bold text-slate-700 tabular-nums">{item.price.toLocaleString()} دج</span>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm ${
                          isLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="font-bold text-slate-600 tabular-nums">{totalValue.toLocaleString()} دج</span>
                      </td>
                      <td className="p-5 text-center">
                        <button
                          className={`p-2 rounded-xl transition-all ${
                            isLow 
                              ? 'bg-rose-100 text-rose-600 animate-pulse' 
                              : 'bg-emerald-100 text-emerald-600'
                          }`}
                          title={isLow ? 'مخزون منخفض!' : 'مخزون جيد'}
                        >
                          {isLow ? <AlertCircle size={18} /> : <Bell size={18} />}
                        </button>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all hover:scale-110"
                            title="تعديل"
                          >
                            <Edit2 size={18} />
                          </button>
                          
                          {deleteConfirm === item._id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDelete(item._id || "")}
                                disabled={deleting}
                                className="px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all disabled:opacity-50"
                              >
                                تأكيد
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-all"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(item._id || "")}
                              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white transition-all hover:scale-110"
                              title="حذف"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockComponent;