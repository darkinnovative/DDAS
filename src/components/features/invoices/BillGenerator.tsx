import { FileText } from 'lucide-react';

export function BillGenerator() {
  return (
    <div className="p-6">
      <div className="text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bill Generator</h2>
        <p className="text-gray-600">Generate bills and invoices</p>
      </div>
    </div>
  );
}
