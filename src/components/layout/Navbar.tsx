import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CreditCard, 
  Settings 
} from 'lucide-react';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>BillingApp</h2>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink to="/" className="nav-link">
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/invoices" className="nav-link">
            <FileText size={20} />
            Invoices
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/customers" className="nav-link">
            <Users size={20} />
            Customers
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/payments" className="nav-link">
            <CreditCard size={20} />
            Payments
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className="nav-link">
            <Settings size={20} />
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
