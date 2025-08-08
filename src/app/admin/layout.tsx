import { MainLayout } from '@/components/layout'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return <MainLayout>{children}</MainLayout>
}
