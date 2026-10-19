import { Head, Link } from '@inertiajs/react';
import { Badge } from '@idds/react';
import {
    IconArrowDownRight,
    IconArrowNarrowRight,
    IconArrowUpRight,
    IconBuildingWarehouse,
    IconCircleCheck,
    IconClipboardCheck,
    IconDeviceDesktop,
    IconMapPin,
    IconTool,
} from '@tabler/icons-react';
import AuthenticatedLayout from '../Components/AuthenticatedLayout';

const conditionLabels = {
    good: 'Baik',
    fair: 'Cukup',
    poor: 'Perlu servis',
    damaged: 'Rusak',
};

const conditionVariants = {
    good: 'success',
    fair: 'warning',
    poor: 'danger',
    damaged: 'danger',
};

const checkLabels = {
    pending: 'Menunggu tinjauan',
    reviewed: 'Sudah ditinjau',
};

function number(value) {
    return new Intl.NumberFormat('id-ID').format(value ?? 0);
}

function date(value) {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function Dashboard({ stats, recentChecks, conditionCounts, isAdmin }) {
    const conditionTotal = Object.values(conditionCounts).reduce((total, value) => total + value, 0) || 1;
    const healthPercent = Math.round((conditionCounts.good / conditionTotal) * 100);

    return (
        <AuthenticatedLayout
            title="Ringkasan"
            eyebrow={isAdmin ? 'PUSAT PEMANTAUAN ADMIN' : 'RUANG KERJA PETUGAS'}
            actions={(
                <Link href="/checks" className="quiet-action">
                    <span>Lihat pemeriksaan</span><IconArrowNarrowRight size={17} />
                </Link>
            )}
        >
            <Head title="Ringkasan" />
            <section className="welcome-band">
                <div className="welcome-text">
                    <span className="welcome-tag"><IconDeviceDesktop size={14} /> INVENTARIS TEKNOLOGI INFORMASI</span>
                    <h2 className="font-display">Selamat bekerja, <em>semua tercatat.</em></h2>
                    <p>{isAdmin
                        ? 'Pantau kondisi aset dan tindak lanjuti pemeriksaan yang masuk.'
                        : 'Periksa kondisi aset di lokasi Anda, lalu kirim catatan untuk ditinjau.'}</p>
                </div>
                <div className="welcome-illustration" aria-hidden="true">
                    <div className="illustration-halo" />
                    <div className="illustration-card">
                        <div className="illustration-screen"><div /><div /><div /></div>
                        <div className="illustration-base" />
                    </div>
                    <span className="illustration-spark spark-a">✳</span>
                    <span className="illustration-spark spark-b">✳</span>
                </div>
            </section>

            <section className="stats-grid" aria-label="Statistik aset">
                <article className="stat-card stat-card-main">
                    <div className="stat-topline">
                        <span className="stat-icon"><IconBuildingWarehouse size={19} /></span>
                        <span className="stat-trend"><IconArrowUpRight size={15} /> Inventaris</span>
                    </div>
                    <p className="stat-label">Total aset terdaftar</p>
                    <div className="stat-value">{number(stats.total)}<small> unit</small></div>
                    <div className="stat-foot"><span>Seluruh perangkat yang tercatat</span><span className="stat-index">01</span></div>
                </article>
                <article className="stat-card stat-card-good">
                    <div className="stat-topline">
                        <span className="stat-icon"><IconCircleCheck size={19} /></span>
                        <span className="stat-trend positive">Kondisi baik</span>
                    </div>
                    <p className="stat-label">Siap digunakan</p>
                    <div className="stat-value">{number(stats.good)}<small> unit</small></div>
                    <div className="stat-foot"><span>{healthPercent}% dari total aset</span><span className="stat-index">02</span></div>
                </article>
                <article className="stat-card stat-card-attention">
                    <div className="stat-topline">
                        <span className="stat-icon"><IconTool size={19} /></span>
                        <span className="stat-trend caution"><IconArrowDownRight size={14} /> Perlu perhatian</span>
                    </div>
                    <p className="stat-label">Perlu pemeriksaan</p>
                    <div className="stat-value">{number(stats.attention)}<small> unit</small></div>
                    <div className="stat-foot"><span>Termasuk kondisi rusak / servis</span><span className="stat-index">03</span></div>
                </article>
                {isAdmin && (
                    <article className="stat-card stat-card-pending">
                        <div className="stat-topline">
                            <span className="stat-icon"><IconClipboardCheck size={19} /></span>
                            <Badge text={`${number(stats.pending)} baru`} variant={stats.pending ? 'warning' : 'success'} />
                        </div>
                        <p className="stat-label">Menunggu tinjauan</p>
                        <div className="stat-value">{number(stats.pending)}<small> laporan</small></div>
                        <div className="stat-foot"><span>Catatan dari petugas aset</span><span className="stat-index">04</span></div>
                    </article>
                )}
            </section>

            <section className="dashboard-lower">
                <article className="surface-card activity-card">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">AKTIVITAS TERKINI</p>
                            <h3 className="font-display">Pemeriksaan terbaru</h3>
                        </div>
                        <Link href="/checks" className="text-link">Semua catatan <IconArrowNarrowRight size={16} /></Link>
                    </div>
                    {recentChecks.length ? (
                        <div className="activity-list">
                            {recentChecks.map((check) => (
                                <div className="activity-row" key={check.id}>
                                    <div className={`activity-mark mark-${check.condition}`}>
                                        <IconClipboardCheck size={18} />
                                    </div>
                                    <div className="activity-copy">
                                        <strong>{check.asset?.name ?? 'Aset dihapus'}</strong>
                                        <span>{check.asset?.asset_code} <i /> oleh {check.user?.name ?? 'Petugas'}</span>
                                    </div>
                                    <div className="activity-meta">
                                        <Badge text={conditionLabels[check.condition]} variant={conditionVariants[check.condition]} />
                                        <small>{date(check.created_at)}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state compact-empty">
                            <IconClipboardCheck size={25} />
                            <strong>Belum ada pemeriksaan</strong>
                            <span>Laporan kondisi dari petugas akan muncul di sini.</span>
                        </div>
                    )}
                    <Link href="/checks" className="activity-bottom-link">Buka daftar pemeriksaan <IconArrowNarrowRight size={16} /></Link>
                </article>

                <article className="surface-card condition-card">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">KESEHATAN INVENTARIS</p>
                            <h3 className="font-display">Kondisi aset</h3>
                        </div>
                        <span className="condition-period">SAAT INI</span>
                    </div>
                    <div className="condition-ring-wrap">
                        <div className="condition-ring" style={{ '--good-share': `${healthPercent}%` }}>
                            <div><strong>{healthPercent}<small>%</small></strong><span>kondisi baik</span></div>
                        </div>
                        <div className="condition-total">
                            <span>Total terdata</span>
                            <strong>{number(stats.total)} <small>aset</small></strong>
                        </div>
                    </div>
                    <div className="condition-legend">
                        {Object.entries(conditionLabels).map(([key, label]) => (
                            <div className="legend-row" key={key}>
                                <span className={`legend-dot dot-${key}`} />
                                <span>{label}</span>
                                <strong>{number(conditionCounts[key])}</strong>
                                <small>{Math.round((conditionCounts[key] / conditionTotal) * 100)}%</small>
                            </div>
                        ))}
                    </div>
                    <Link href="/assets" className="condition-link">Lihat inventaris aset <IconArrowNarrowRight size={16} /></Link>
                </article>
            </section>

            <section className="dashboard-tip">
                <div className="tip-icon"><IconMapPin size={18} /></div>
                <p><strong>Tips inventaris</strong> Perbarui lokasi dan kondisi setelah aset dipindahkan atau diperiksa.</p>
                <Link href="/assets" className="tip-action">Buka inventaris <IconArrowUpRight size={16} /></Link>
            </section>
        </AuthenticatedLayout>
    );
}
