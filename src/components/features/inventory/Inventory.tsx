import { Package } from 'lucide-react';

export function Inventory() {
  return (
    <div className="p-6">
      <div className="text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Inventory Management</h2>
        <p className="text-gray-600">Manage your inventory and stock levels</p>
      </div>
    </div>
  );
}
