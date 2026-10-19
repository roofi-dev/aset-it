import { useMemo, useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Badge, Button, InputSearch, Modal, TextArea, TextField } from '@idds/react';
import {
    IconAdjustmentsHorizontal,
    IconBuildingWarehouse,
    IconChevronDown,
    IconEdit,
    IconMapPin,
    IconPlus,
    IconSearch,
} from '@tabler/icons-react';
import AuthenticatedLayout from '../../Components/AuthenticatedLayout';

const conditionOptions = [
    { value: 'good', label: 'Baik' },
    { value: 'fair', label: 'Cukup' },
    { value: 'poor', label: 'Perlu servis' },
    { value: 'damaged', label: 'Rusak' },
];

const statusOptions = [
    { value: 'available', label: 'Tersedia' },
    { value: 'in_use', label: 'Digunakan' },
    { value: 'maintenance', label: 'Perawatan' },
    { value: 'retired', label: 'Tidak aktif' },
];

const blankAsset = {
    asset_code: '',
    name: '',
    category: '',
    brand: '',
    model: '',
    serial_number: '',
    location: '',
    condition: 'good',
    status: 'available',
    purchase_date: '',
    purchase_price: '',
    notes: '',
};

const conditionLabel = Object.fromEntries(conditionOptions.map(({ value, label }) => [value, label]));
const conditionVariant = { good: 'success', fair: 'warning', poor: 'danger', damaged: 'danger' };
const statusLabel = Object.fromEntries(statusOptions.map(({ value, label }) => [value, label]));
const statusVariant = { available: 'info', in_use: 'success', maintenance: 'warning', retired: 'neutral' };

function formatPrice(value) {
    return value
        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
        : '—';
}

function AssetFormField({ label, name, data, setData, errors, ...props }) {
    return (
        <div className="idds-field">
            <TextField
                label={label}
                value={data[name] ?? ''}
                onChange={(value) => setData(name, value)}
                status={errors[name] ? 'error' : 'neutral'}
                statusMessage={errors[name]}
                showClearButton={false}
                {...props}
            />
        </div>
    );
}

export default function AssetsIndex({ assets, filters, categories, canManage, canCreate }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(blankAsset);
    const currentFilters = usePage().url;
    const filterParams = useMemo(() => new URLSearchParams(currentFilters.split('?')[1] ?? ''), [currentFilters]);

    function changeFilter(key, value) {
        if (value) filterParams.set(key, value);
        else filterParams.delete(key);
        filterParams.delete('page');
        router.get('/assets', Object.fromEntries(filterParams), { preserveState: true, replace: true });
    }

    function openCreate() {
        setEditing(null);
        reset();
        clearErrors();
        setModalOpen(true);
    }

    function openEdit(asset) {
        setEditing(asset);
        setData({
            asset_code: asset.asset_code ?? '',
            name: asset.name ?? '',
            category: asset.category ?? '',
            brand: asset.brand ?? '',
            model: asset.model ?? '',
            serial_number: asset.serial_number ?? '',
            location: asset.location ?? '',
            condition: asset.condition ?? 'good',
            status: asset.status ?? 'available',
            purchase_date: asset.purchase_date?.slice(0, 10) ?? '',
            purchase_price: asset.purchase_price ?? '',
            notes: asset.notes ?? '',
        });
        clearErrors();
        setModalOpen(true);
    }

    function save(event) {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setModalOpen(false);
                setEditing(null);
                reset();
            },
        };

        if (editing) put(`/assets/${editing.id}`, options);
        else post('/assets', options);
    }

    const pageLinks = assets.links?.filter((link) => link.url) ?? [];

    return (
        <AuthenticatedLayout
            title="Inventaris aset"
            eyebrow="DAFTAR PERANGKAT"
            actions={canCreate && (
                <Button hierarchy="primary" size="md" prefixIcon={<IconPlus size={17} />} onClick={openCreate}>
                    Tambah aset
                </Button>
            )}
        >
            <Head title="Inventaris aset" />
            <section className="inventory-intro">
                <div className="inventory-intro-icon"><IconBuildingWarehouse size={22} /></div>
                <div>
                    <strong>Semua inventaris, dalam satu daftar.</strong>
                    <span>Telusuri perangkat dan catatan kondisi berdasarkan kategori, lokasi, atau kode aset.</span>
                </div>
                <div className="inventory-total"><strong>{assets.total}</strong><span>ASET TERCATAT</span></div>
            </section>

            <section className="surface-card inventory-card">
                <div className="inventory-toolbar">
                    <div className="toolbar-title">
                        <div>
                            <h2 className="font-display">Daftar inventaris</h2>
                            <p>Data inventaris teknologi informasi</p>
                        </div>
                    </div>
                    <div className="filter-controls">
                        <div className="inventory-search">
                            <InputSearch
                                value={filters.search ?? ''}
                                onChange={(value) => changeFilter('search', value)}
                                placeholder="Cari nama atau kode aset"
                                aria-label="Cari aset"
                                debounce={350}
                                showClearButton
                            />
                        </div>
                        <label className="filter-select-wrap">
                            <IconAdjustmentsHorizontal size={16} />
                            <select aria-label="Filter kondisi" value={filters.condition ?? ''} onChange={(event) => changeFilter('condition', event.target.value)}>
                                <option value="">Semua kondisi</option>
                                {conditionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </select>
                            <IconChevronDown size={14} />
                        </label>
                        <label className="filter-select-wrap category-filter">
                            <select aria-label="Filter kategori" value={filters.category ?? ''} onChange={(event) => changeFilter('category', event.target.value)}>
                                <option value="">Semua kategori</option>
                                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                            </select>
                            <IconChevronDown size={14} />
                        </label>
                    </div>
                </div>

                <div className="table-scroll">
                    <table className="asset-table">
                        <thead>
                            <tr>
                                <th>PERANGKAT</th>
                                <th>LOKASI</th>
                                <th>KONDISI</th>
                                <th>STATUS</th>
                                <th>HARGA PEROLEHAN</th>
                                {canManage && <th><span className="sr-only">Aksi</span></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {assets.data.map((asset) => (
                                <tr key={asset.id}>
                                    <td>
                                        <div className="asset-identity">
                                            <div className={`device-icon device-${asset.category.toLowerCase()}`}><IconBuildingWarehouse size={18} /></div>
                                            <div>
                                                <strong>{asset.name}</strong>
                                                <span><b>{asset.asset_code}</b><i />{asset.category}{asset.brand ? ` · ${asset.brand}` : ''}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="asset-location"><IconMapPin size={15} /><span>{asset.location}</span></div>
                                    </td>
                                    <td><Badge text={conditionLabel[asset.condition]} variant={conditionVariant[asset.condition]} /></td>
                                    <td><Badge text={statusLabel[asset.status]} variant={statusVariant[asset.status]} /></td>
                                    <td><span className="asset-price">{formatPrice(asset.purchase_price)}</span></td>
                                    {canManage && (
                                        <td className="asset-actions">
                                            <Button hierarchy="tertiary" size="sm" prefixIcon={<IconEdit size={16} />} onClick={() => openEdit(asset)}>
                                                Ubah
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {!assets.data.length && (
                                <tr><td colSpan={canManage ? 6 : 5}>
                                    <div className="empty-state">
                                        <IconSearch size={26} />
                                        <strong>Tidak ada aset yang cocok</strong>
                                        <span>Coba ubah kata kunci atau filter yang dipilih.</span>
                                    </div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer">
                    <span>Menampilkan <strong>{assets.from ?? 0}–{assets.to ?? 0}</strong> dari <strong>{assets.total}</strong> aset</span>
                    <div className="pagination-actions">
                        {pageLinks.map((link, index) => {
                            const label = link.label.replace('&laquo; Previous', '‹').replace('Next &raquo;', '›');
                            const isPrevious = index === 0;
                            const isNext = index === pageLinks.length - 1;

                            return (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`pagination-button ${link.active ? 'is-active' : ''} ${!link.url ? 'is-disabled' : ''}`}
                                    aria-label={isPrevious ? 'Halaman sebelumnya' : isNext ? 'Halaman berikutnya' : `Halaman ${label}`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {canCreate && (
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={editing ? 'Ubah data aset' : 'Tambah aset baru'}
                    size="lg"
                >
                    <form onSubmit={save} className="asset-form">
                        <p className="modal-intro">Lengkapi informasi perangkat agar inventaris selalu akurat.</p>
                        <div className="asset-form-grid">
                            <AssetFormField label="Kode aset" name="asset_code" data={data} setData={setData} errors={errors} placeholder="Contoh: ATK-025" />
                            <AssetFormField label="Nama perangkat" name="name" data={data} setData={setData} errors={errors} placeholder="Contoh: Laptop ThinkPad" />
                            <AssetFormField label="Kategori" name="category" data={data} setData={setData} errors={errors} placeholder="Laptop, Printer, Jaringan" />
                            <AssetFormField label="Lokasi" name="location" data={data} setData={setData} errors={errors} placeholder="Contoh: Ruang IT" />
                            <AssetFormField label="Merek" name="brand" data={data} setData={setData} errors={errors} placeholder="Merek perangkat" />
                            <AssetFormField label="Model" name="model" data={data} setData={setData} errors={errors} placeholder="Model perangkat" />
                            <AssetFormField label="Nomor seri" name="serial_number" data={data} setData={setData} errors={errors} placeholder="Nomor seri (opsional)" />
                            <div className="plain-field">
                                <label htmlFor="asset-condition">Kondisi</label>
                                <select id="asset-condition" value={data.condition} onChange={(event) => setData('condition', event.target.value)}>
                                    {conditionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                                {errors.condition && <small className="field-error">{errors.condition}</small>}
                            </div>
                            <div className="plain-field">
                                <label htmlFor="asset-status">Status penggunaan</label>
                                <select id="asset-status" value={data.status} onChange={(event) => setData('status', event.target.value)}>
                                    {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                                {errors.status && <small className="field-error">{errors.status}</small>}
                            </div>
                            <div className="plain-field">
                                <label htmlFor="purchase-date">Tanggal perolehan</label>
                                <input id="purchase-date" type="date" className="plain-control" value={data.purchase_date} onChange={(event) => setData('purchase_date', event.target.value)} />
                                {errors.purchase_date && <small className="field-error">{errors.purchase_date}</small>}
                            </div>
                            <div className="plain-field">
                                <label htmlFor="purchase-price">Harga perolehan (Rp)</label>
                                <input id="purchase-price" type="number" min="0" className="plain-control" value={data.purchase_price} onChange={(event) => setData('purchase_price', event.target.value)} placeholder="0" />
                                {errors.purchase_price && <small className="field-error">{errors.purchase_price}</small>}
                            </div>
                            <div className="idds-field form-span-two">
                                <TextArea
                                    label="Catatan tambahan"
                                    value={data.notes}
                                    onChange={(value) => setData('notes', value)}
                                    placeholder="Tambahkan detail kondisi atau informasi lainnya"
                                    rows={3}
                                    maxLength={2000}
                                />
                                {errors.notes && <small className="field-error">{errors.notes}</small>}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <Button hierarchy="secondary" type="button" onClick={() => setModalOpen(false)}>Batal</Button>
                            <Button hierarchy="primary" type="submit" disabled={processing}>{processing ? 'Menyimpan…' : 'Simpan aset'}</Button>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
