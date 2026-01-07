import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Factory,
  Package,
  Users,
  FileText,
  Wallet,
  Truck,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Factory, label: 'Nhà máy', path: '/admin/nha-may' },
  { icon: Package, label: 'Sản phẩm', path: '/admin/san-pham' },
  { icon: Users, label: 'Khách hàng', path: '/admin/khach-hang' },
  { icon: FileText, label: 'Hóa đơn', path: '/admin/hoa-don' },
  { icon: Wallet, label: 'Thu tiền', path: '/admin/thu-tien' },
  { icon: Truck, label: 'Chuyến chở', path: '/admin/chuyen-cho' },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

const AdminSidebar = ({ onNavigate }: AdminSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="lg:fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Package className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              Gạch Việt
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Quản trị hệ thống</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                active
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm text-sidebar-foreground/70">Giao diện</span>
          <ThemeToggle />
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent/50 hover:text-sidebar-foreground">
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
