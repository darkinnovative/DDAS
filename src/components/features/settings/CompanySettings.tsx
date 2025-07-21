import { useState, useEffect } from 'react';
import { useBilling } from '../../../context/BillingContext';
import { Building, Save, RotateCcw, Upload, MapPin, Phone, Globe, FileText, Calendar, DollarSign } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import type { Company } from '../../../types/billing';

interface CompanyFormData {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  website: string;
  taxId: string;
  gstNumber: string;
  panNumber: string;
  stateCode: string;
  registrationNumber: string;
  logo: string;
  financialYear: {
    startDate: string;
    endDate: string;
  };
  currency: string;
  taxRate: number;
}

export function CompanySettings() {
  const { company, updateCompany } = useBilling();
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    phone: '',
    email: '',
    website: '',
    taxId: '',
    gstNumber: '',
    panNumber: '',
    stateCode: '',
    registrationNumber: '',
    logo: '',
    financialYear: {
      startDate: '2024-04-01',
      endDate: '2025-03-31'
    },
    currency: 'INR',
    taxRate: 18
  });

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Load existing company data
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email,
        website: company.website || '',
        taxId: company.taxId,
        gstNumber: company.gstNumber,
        panNumber: company.panNumber,
        stateCode: company.stateCode,
        registrationNumber: company.registrationNumber || '',
        logo: company.logo || '',
        financialYear: {
          startDate: company.financialYear.startDate.toISOString().split('T')[0],
          endDate: company.financialYear.endDate.toISOString().split('T')[0]
        },
        currency: company.currency,
        taxRate: company.taxRate
      });
      setLogoPreview(company.logo || '');
    }
  }, [company]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleFinancialYearChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      financialYear: {
        ...prev.financialYear,
        [field]: value
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const companyData: Company = {
        id: company?.id || '1',
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        taxId: formData.taxId,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        stateCode: formData.stateCode,
        registrationNumber: formData.registrationNumber,
        logo: formData.logo,
        financialYear: {
          startDate: new Date(formData.financialYear.startDate),
          endDate: new Date(formData.financialYear.endDate)
        },
        currency: formData.currency,
        taxRate: formData.taxRate,
        createdAt: company?.createdAt || new Date(),
        updatedAt: new Date()
      };

      updateCompany(companyData);
      alert('Company information updated successfully!');
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Error updating company information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (company) {
      setFormData({
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email,
        website: company.website || '',
        taxId: company.taxId,
        gstNumber: company.gstNumber,
        panNumber: company.panNumber,
        stateCode: company.stateCode,
        registrationNumber: company.registrationNumber || '',
        logo: company.logo || '',
        financialYear: {
          startDate: company.financialYear.startDate.toISOString().split('T')[0],
          endDate: company.financialYear.endDate.toISOString().split('T')[0]
        },
        currency: company.currency,
        taxRate: company.taxRate
      });
      setLogoPreview(company.logo || '');
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi'
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Company Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your company information and preferences</p>
        </div>
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
          <Building className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Logo */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Company Logo
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              {logoPreview ? (
                <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <Building className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-block dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Upload Logo
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 200x200px, PNG or JPG
              </p>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration Number
              </label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="Enter registration number"
              />
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.example.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address *
              </label>
              <Input
                value={formData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Enter street address"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <Input
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State *
                </label>
                <select
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ZIP Code *
                </label>
                <Input
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country *
              </label>
              <Input
                value={formData.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                placeholder="Enter country"
                required
              />
            </div>
          </div>
        </Card>

        {/* Tax Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Tax Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GST Number *
              </label>
              <Input
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                placeholder="Enter GST number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                PAN Number *
              </label>
              <Input
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value)}
                placeholder="Enter PAN number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State Code *
              </label>
              <Input
                value={formData.stateCode}
                onChange={(e) => handleInputChange('stateCode', e.target.value)}
                placeholder="Enter state code (e.g., 27)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tax ID *
              </label>
              <Input
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="Enter tax ID"
                required
              />
            </div>
          </div>
        </Card>

        {/* Financial Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Currency *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Tax Rate (%) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                placeholder="18.00"
                required
              />
            </div>
          </div>
        </Card>

        {/* Financial Year */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Financial Year
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <Input
                type="date"
                value={formData.financialYear.startDate}
                onChange={(e) => handleFinancialYearChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date *
              </label>
              <Input
                type="date"
                value={formData.financialYear.endDate}
                onChange={(e) => handleFinancialYearChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Company Information'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
