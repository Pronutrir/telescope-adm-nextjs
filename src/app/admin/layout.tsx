import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return <AdminAuthGuard>{children}</AdminAuthGuard>
}
