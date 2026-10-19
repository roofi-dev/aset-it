import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    IconApps,
    IconBuildingWarehouse,
    IconChevronLeft,
    IconClipboardCheck,
    IconLayoutDashboard,
    IconLogout,
    IconMenu2,
    IconX,
} from '@tabler/icons-react';
import { Button } from '@idds/react';

const navItems = [
    { label: 'Ringkasan', href: '/dashboard', icon: IconLayoutDashboard },
    { label: 'Inventaris aset', href: '/assets', icon: IconBuildingWarehouse },
    { label: 'Pemeriksaan', href: '/checks', icon: IconClipboardCheck },
];

export default function AuthenticatedLayout({ title, eyebrow, actions, children }) {
    const { auth, flash } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const currentUrl = usePage().url.split('?')[0];

    return (
        <div className="min-h-screen">
            <aside className={`app-sidebar ${menuOpen ? 'is-open' : ''}`}>
                <div className="brand-lockup">
                    <Link href="/dashboard" className="brand-link" onClick={() => setMenuOpen(false)}>
                        <span className="brand-mark"><IconApps size={22} stroke={1.8} /></span>
                        <span>
                            <strong>Ruang Aset</strong>
                            <small>IT inventory system</small>
                        </span>
                    </Link>
                    <button className="mobile-close" aria-label="Tutup navigasi" onClick={() => setMenuOpen(false)}>
                        <IconX size={19} />
                    </button>
                </div>

                <div className="sidebar-caption">MENU UTAMA</div>
                <nav className="sidebar-nav" aria-label="Navigasi utama">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = currentUrl === href || (href === '/checks' && currentUrl.startsWith('/checks'));

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={`sidebar-link ${active ? 'active' : ''}`}
                                aria-current={active ? 'page' : undefined}
                            >
                                <Icon size={19} stroke={1.8} />
                                <span>{label}</span>
                                {active && <span className="nav-active-mark" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-note">
                    <div className="sidebar-note-icon"><IconBuildingWarehouse size={17} /></div>
                    <p>Catatan aset yang rapi, keputusan yang lebih cepat.</p>
                    <span>INVENTARIS DIGITAL</span>
                </div>

                <div className="sidebar-profile">
                    <div className="user-avatar">{auth.user.name.slice(0, 1).toUpperCase()}</div>
                    <div className="profile-copy">
                        <strong>{auth.user.name}</strong>
                        <span>{auth.user.role === 'admin' ? 'Administrator' : 'Petugas aset'}</span>
                    </div>
                    <button className="logout-icon" title="Keluar" aria-label="Keluar" onClick={() => router.post('/logout')}>
                        <IconLogout size={18} />
                    </button>
                </div>
            </aside>

            {menuOpen && <button className="mobile-scrim" aria-label="Tutup navigasi" onClick={() => setMenuOpen(false)} />}

            <main className="app-main">
                <header className="topbar">
                    <button className="mobile-menu" aria-label="Buka navigasi" onClick={() => setMenuOpen(true)}>
                        <IconMenu2 size={20} />
                    </button>
                    <div className="topbar-path"><span>Ruang kerja</span><IconChevronLeft size={14} /><strong>{title}</strong></div>
                    <div className="topbar-right">
                        <span className="online-indicator" />
                        <span>Data tersinkron</span>
                    </div>
                </header>

                <div className="page-content animate-enter">
                    {(eyebrow || title || actions) && (
                        <div className="page-heading">
                            <div>
                                {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                                <h1 className="font-display">{title}</h1>
                            </div>
                            {actions}
                        </div>
                    )}
                    {flash?.success && (
                        <div className="flash-success" role="status">
                            <span className="flash-dot" />
                            {flash.success}
                        </div>
                    )}
                    {children}
                </div>
                <footer className="app-footer">
                    <span>Ruang Aset <span className="footer-dot">·</span> Sistem inventaris TI</span>
                    <span>Lingkungan kerja digital</span>
                </footer>
            </main>
        </div>
    );
}

export function PrimaryButton({ children, ...props }) {
    return <Button hierarchy="primary" size="md" {...props}>{children}</Button>;
}
