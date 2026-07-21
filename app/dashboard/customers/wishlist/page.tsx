'use client';

import * as React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Badge, Button } from '@/components/enterprise/BaseInputs';
import { Heart, Search, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConsolidatedWishlistPage() {
  const router = useRouter();
  const { data: customers = [] } = useCustomers();
  const [searchQuery, setSearchQuery] = React.useState('');

  const allWishlist = React.useMemo(() => {
    return customers.flatMap(c => 
      c.wishlist.map(w => ({
        ...w,
        customerName: `${c.firstName} ${c.lastName}`,
        customerCode: c.customerCode,
        id: c.id
      }))
    );
  }, [customers]);

  const filteredItems = allWishlist.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="customer-wishlists-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-500" />
            Consolidated Catalog Wishlists
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Analyze customer preferences and wishlist records to streamline inventory procurement and campaign marketing.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-zinc-850 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">wishlist interest index</h3>
          
          <div className="relative w-full sm:w-64 text-xs">
            <span className="absolute left-2.5 top-2 text-slate-400"><Search className="w-4 h-4" /></span>
            <input
              type="text"
              placeholder="Search product, SKU, user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-xs font-medium">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-850 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                <th className="py-2 px-3">Product Name</th>
                <th className="py-2 px-3">SKU</th>
                <th className="py-2 px-3 text-right">Price</th>
                <th className="py-2 px-3">Enrolled customer</th>
                <th className="py-2 px-3 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic font-semibold">No items matching query.</td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={`${item.sku}-${idx}`} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/40 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-slate-800 dark:text-zinc-200">{item.productName}</td>
                    <td className="py-3.5 px-3 font-mono text-[10px] text-slate-400">{item.sku}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-zinc-50">₹{item.price.toLocaleString()}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-700 dark:text-zinc-300 block">{item.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.customerCode}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => router.push(`/dashboard/customers/view/${item.id}`)}
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
