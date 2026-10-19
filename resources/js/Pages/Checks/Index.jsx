import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Badge, Button, Modal, SelectDropdown, TextArea } from '@idds/react';
import {
    IconArrowNarrowRight,
    IconClipboardCheck,
    IconPlus,
    IconSearch,
    IconShieldCheck,
} from '@tabler/icons-react';
import AuthenticatedLayout from '../../Components/AuthenticatedLayout';

const conditionChoices = [
    { label: 'Baik', value: 'good' },
    { label: 'Cukup', value: 'fair' },
    { label: 'Perlu servis', value: 'poor' },
    { label: 'Rusak', value: 'damaged' },
];

const conditionLabels = Object.fromEntries(conditionChoices.map(({ label, value }) => [value, label]));
const variants = { good: 'success', fair: 'warning', poor: 'danger', damaged: 'danger' };

function displayDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export default function ChecksIndex({ checks, assets, isAdmin, filters }) {
    const [modalOpen, setModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        asset_id: '',
        condition: 'good',
        notes: '',
    });

    function submit(event) {
        event.preventDefault();
        post('/checks', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setModalOpen(false);
            },
        });
    }

    const assetOptions = assets.map((asset) => ({
        label: `${asset.asset_code} · ${asset.name}`,
        value: asset.id,
    }));

    return (
        <AuthenticatedLayout
            title="Pemeriksaan"
            eyebrow={isAdmin ? 'TINJAUAN KONDISI ASET' : 'CATATAN KONDISI ASET'}
            actions={!isAdmin && (
                <Button hierarchy="primary" size="md" prefixIcon={<IconPlus size={17} />} onClick={() => setModalOpen(true)}>
                    Catat pemeriksaan
                </Button>
            )}
        >
            <Head title="Pemeriksaan aset" />
            <section className="checks-banner">
                <div className="checks-banner-symbol"><IconClipboardCheck size={24} /></div>
                <div>
                    <p className="eyebrow">{isAdmin ? 'MONITORING ADMIN' : 'PEMERIKSAAN LAPANGAN'}</p>
                    <h2 className="font-display">{isAdmin ? 'Tinjau laporan dari tim.' : 'Kondisi terakhir aset, tercatat.'}</h2>
                    <p>{isAdmin
                        ? 'Pastikan setiap laporan kondisi sudah ditinjau dan ditindaklanjuti.'
                        : 'Pilih aset, catat kondisinya, dan sertakan detail agar riwayat inventaris tetap akurat.'}</p>
                </div>
                <div className="checks-banner-count">
                    <span>{isAdmin ? checks.data.filter((check) => check.review_status === 'pending').length : checks.total}</span>
                    <small>{isAdmin ? 'MENUNGGU TINJAUAN' : 'CATATAN TERLIHAT'}</small>
                </div>
            </section>

            {isAdmin && (
                <div className="check-filter-row">
                    <div className="filter-summary"><IconShieldCheck size={16} /> Semua laporan kondisi</div>
                    <label className="filter-select-wrap">
                        <select value={filters.status ?? ''} onChange={(event) => router.get('/checks', event.target.value ? { status: event.target.value } : {}, { preserveState: true, replace: true })}>
                            <option value="">Semua status tinjauan</option>
                            <option value="pending">Menunggu tinjauan</option>
                            <option value="reviewed">Sudah ditinjau</option>
                        </select>
                    </label>
                </div>
            )}

            <section className="surface-card checks-card">
                <div className="checks-card-heading">
                    <div>
                        <h2 className="font-display">{isAdmin ? 'Laporan pemeriksaan' : 'Riwayat pemeriksaan saya'}</h2>
                        <p>{checks.total} catatan tersimpan</p>
                    </div>
                    <div className="checks-info-pill"><span /> DATA TERSIMPAN</div>
                </div>
                {checks.data.length ? (
                    <div className="checks-list">
                        {checks.data.map((check) => (
                            <article className="check-row" key={check.id}>
                                <div className={`check-condition-icon mark-${check.condition}`}><IconClipboardCheck size={19} /></div>
                                <div className="check-asset-copy">
                                    <div className="check-asset-line">
                                        <strong>{check.asset?.name ?? 'Aset dihapus'}</strong>
                                        <Badge text={conditionLabels[check.condition]} variant={variants[check.condition]} />
                                    </div>
                                    <span className="check-code">{check.asset?.asset_code} <i /> {check.asset?.location}</span>
                                    <p>{check.notes}</p>
                                    <div className="check-meta">
                                        <span>Dilaporkan oleh <strong>{check.user?.name}</strong></span>
                                        <i />
                                        <span>{displayDate(check.created_at)}</span>
                                    </div>
                                </div>
                                <div className="check-row-action">
                                    {isAdmin ? (
                                        check.review_status === 'pending' ? (
                                            <Button hierarchy="secondary" size="sm" onClick={() => router.post(`/checks/${check.id}/review`, {}, { preserveScroll: true })}>
                                                Tandai ditinjau
                                            </Button>
                                        ) : (
                                            <div className="reviewed-copy"><span><IconShieldCheck size={15} /> Ditinjau</span><small>{check.reviewer?.name ?? 'Administrator'}</small></div>
                                        )
                                    ) : (
                                        <Badge text={check.review_status === 'reviewed' ? 'Sudah ditinjau' : 'Menunggu'} variant={check.review_status === 'reviewed' ? 'success' : 'warning'} />
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state checks-empty">
                        <IconSearch size={26} />
                        <strong>Belum ada catatan pemeriksaan</strong>
                        <span>{isAdmin ? 'Laporan dari petugas akan tampil di sini.' : 'Catatan kondisi yang Anda kirim akan muncul di sini.'}</span>
                    </div>
                )}
                <div className="table-footer">
                    <span>Menampilkan <strong>{checks.from ?? 0}–{checks.to ?? 0}</strong> dari <strong>{checks.total}</strong> catatan</span>
                    <div className="pagination-actions">
                        {checks.links?.filter((link) => link.url).map((link, index) => {
                            const label = link.label.replace('&laquo; Previous', '‹').replace('Next &raquo;', '›');
                            return (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url}
                                    preserveScroll
                                    className={`pagination-button ${link.active ? 'is-active' : ''}`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {!isAdmin && (
                <section className="check-process-note">
                    <div className="tip-icon"><IconShieldCheck size={18} /></div>
                    <span>Setiap pemeriksaan langsung memperbarui kondisi terkini aset dan masuk ke antrean tinjauan administrator.</span>
                    <Link href="/assets">Lihat inventaris <IconArrowNarrowRight size={16} /></Link>
                </section>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Catat pemeriksaan kondisi" size="md">
                <form onSubmit={submit} className="check-form">
                    <p className="modal-intro">Pilih aset dan tulis kondisi terakhir berdasarkan pemeriksaan langsung.</p>
                    <div className="plain-field">
                        <label>Pilih aset</label>
                        <SelectDropdown
                            options={assetOptions}
                            selected={data.asset_id ? Number(data.asset_id) : ''}
                            onSelect={(value) => setData('asset_id', String(value ?? ''))}
                            placeholder="Cari kode atau nama aset"
                            searchable
                            panelHeight={240}
                        />
                        {errors.asset_id && <small className="field-error">{errors.asset_id}</small>}
                    </div>
                    <div className="plain-field">
                        <label>Kondisi yang ditemukan</label>
                        <SelectDropdown
                            options={conditionChoices}
                            selected={data.condition}
                            onSelect={(value) => setData('condition', value)}
                            searchable={false}
                        />
                        {errors.condition && <small className="field-error">{errors.condition}</small>}
                    </div>
                    <div className="idds-field">
                        <TextArea
                            label="Catatan pemeriksaan"
                            value={data.notes}
                            onChange={(value) => setData('notes', value)}
                            placeholder="Contoh: Layar normal, baterai perlu diganti..."
                            rows={4}
                            maxLength={2000}
                            showCharCount
                        />
                        {errors.notes && <small className="field-error">{errors.notes}</small>}
                    </div>
                    <div className="modal-actions">
                        <Button hierarchy="secondary" type="button" onClick={() => setModalOpen(false)}>Batal</Button>
                        <Button hierarchy="primary" type="submit" disabled={processing}>{processing ? 'Mengirim…' : 'Kirim pemeriksaan'}</Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
