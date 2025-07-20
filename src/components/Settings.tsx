import { Settings as SettingsIcon, User, Building, Palette, Save, RotateCcw, Shield, Bell, Globe, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { theme, setTheme, isDarkMode } = useAuth();
  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-violet-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your DDAS experience and manage preferences</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-xl shadow-lg">
          <SettingsIcon size={32} className="text-white" />
        </div>
      </div>
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
                      hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <User size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">Profile Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                placeholder="Enter your phone number" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
                      hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">Company Information</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
              <input 
                type="text" 
                placeholder="Enter company name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Address</label>
              <textarea 
                placeholder="Enter company address" 
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tax ID / Registration Number</label>
              <input 
                type="text" 
                placeholder="Enter tax ID" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
                      hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <SettingsIcon size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">Invoice Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Default Tax Rate (%)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                step="0.01" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Terms (Days)</label>
              <input 
                type="number" 
                placeholder="30" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Default Currency</label>
              <div className="relative">
                <Globe size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance & Notifications */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
                      hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Palette size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">Appearance & Preferences</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Theme Preference</label>
              <div className="space-y-3">
                {/* Light Mode */}
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${theme === 'light' 
                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                    : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="light"
                    checked={theme === 'light'}
                    onChange={() => setTheme('light')}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" 
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Sun size={20} className="text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Light Mode</div>
                      <div className="text-sm text-gray-600">Bright and clean interface</div>
                    </div>
                  </div>
                </label>

                {/* Dark Mode */}
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${theme === 'dark' 
                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                    : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" 
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <Moon size={20} className="text-gray-300" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Dark Mode</div>
                      <div className="text-sm text-gray-600">Easy on the eyes in low light</div>
                    </div>
                  </div>
                </label>

                {/* System Mode */}
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${theme === 'system' 
                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                    : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="system"
                    checked={theme === 'system'}
                    onChange={() => setTheme('system')}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" 
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Monitor size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">System</div>
                      <div className="text-sm text-gray-600">
                        Follow device settings {isDarkMode ? '(Currently Dark)' : '(Currently Light)'}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Notifications</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">New invoice notifications</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Security alerts</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700
                           hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2
                           hover:border-gray-400">
            <RotateCcw size={20} />
            Reset to Defaults
          </button>
          <button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 
                           text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 
                           flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
