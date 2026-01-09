import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Factory,
  Package,
  Users,
  FileText,
  Wallet,
  Truck,
  LogOut,
  Sparkles,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Factory, label: "Nhà máy", path: "/admin/nha-may" },
  { icon: Package, label: "Sản phẩm", path: "/admin/san-pham" },
  { icon: Users, label: "Khách hàng", path: "/admin/khach-hang" },
  { icon: FileText, label: "Hóa đơn", path: "/admin/hoa-don" },
  { icon: Wallet, label: "Thu tiền", path: "/admin/thu-tien" },
  { icon: History, label: "Lich sử thu tiền", path: "/admin/lich-su-thu-tien" },
  { icon: History, label: "Lich sử công nợ", path: "/admin/lich-su-cong-no" },
  { icon: Truck, label: "Chuyến chở", path: "/admin/chuyen-cho" },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

const AdminSidebar = ({ onNavigate }: AdminSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="lg:fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 shadow-lg">
            <Sparkles className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
              Gạch Việt
            </h1>
            <p className="text-xs text-sidebar-foreground/60 font-medium">
              Quản trị hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5 p-4 overflow-y-auto scrollbar-thin">
        <p className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
          Menu chính
        </p>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="h-5 w-5" />
              {item.label}
              {active && (
                <div className="ml-auto h-2 w-2 rounded-full bg-sidebar-primary-foreground/80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
