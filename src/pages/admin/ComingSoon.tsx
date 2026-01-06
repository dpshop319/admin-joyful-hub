import AdminHeader from '@/components/admin/AdminHeader';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => {
  return (
    <div className="min-h-screen">
      <AdminHeader title={title} />
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <Construction className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">Đang phát triển</h2>
          <p className="mt-2 text-muted-foreground">
            Tính năng {title} sẽ sớm được hoàn thiện
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
