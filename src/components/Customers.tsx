import { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Users } from 'lucide-react';

export function Customers() {
  const { customers, deleteCustomer } = useBilling();
  const { isDarkMode } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-gray-600">Manage your customers and their information</p>
        </div>
        <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 
                         text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 
                         flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <Plus size={20} />
          New Customer
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{customers.length}</p>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Active customer base
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg">
            <Users size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">Search Customers</label>
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-all duration-200 bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div key={customer.id} 
                 className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 
                          hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 
                          hover:border-indigo-200 relative overflow-hidden group">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{customer.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">Customer ID: {customer.id}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors
                                     hover:scale-110 transform duration-200" 
                            title="Edit Customer">
                      <Edit size={16} />
                    </button>
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors
                               hover:scale-110 transform duration-200"
                      title="Delete Customer"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Mail size={16} className="text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium break-all">{customer.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone size={16} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium">{customer.phone}</span>
                  </div>
                </div>
                
                {/* Address */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3 text-gray-600">
                    <div className="p-2 bg-purple-100 rounded-lg mt-0.5">
                      <MapPin size={16} className="text-purple-600" />
                    </div>
                    <div className="text-sm leading-relaxed">
                      <p className="font-medium text-gray-700">{customer.address.street}</p>
                      <p>
                        {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                      </p>
                      <p className="font-medium text-gray-700">{customer.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <Users size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search term to find customers'
                  : 'Add your first customer to get started with managing your client base'
                }
              </p>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 
                               text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 
                               inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
                <Plus size={20} />
                Add First Customer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
