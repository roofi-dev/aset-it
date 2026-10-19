import { Head, useForm } from '@inertiajs/react';
import { IconApps, IconArrowNarrowRight, IconCheck, IconLock, IconShieldCheck } from '@tabler/icons-react';
import { Button, PasswordInput, TextField } from '@idds/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(event) {
        event.preventDefault();
        post('/login');
    }

    return (
        <>
            <Head title="Masuk" />
            <main className="login-screen">
                <section className="login-story">
                    <div className="login-story-orbit orbit-one" />
                    <div className="login-story-orbit orbit-two" />
                    <div className="login-brand">
                        <span className="brand-mark brand-mark-light"><IconApps size={22} /></span>
                        <span><strong>Ruang Aset</strong><small>INVENTARIS TEKNOLOGI INFORMASI</small></span>
                    </div>
                    <div className="login-story-copy">
                        <div className="story-chip"><span /> WORKSPACE OPERASIONAL</div>
                        <h1 className="font-display">Aset terjaga.<br /><em>Kerja lebih terarah.</em></h1>
                        <p>Kelola inventaris TI dan pantau kondisinya dalam satu ruang kerja yang jelas.</p>
                        <div className="story-points">
                            <span><IconCheck size={16} /> Catatan inventaris terpusat</span>
                            <span><IconCheck size={16} /> Pemeriksaan kondisi tercatat</span>
                            <span><IconCheck size={16} /> Pemantauan untuk administrator</span>
                        </div>
                    </div>
                    <div className="login-story-bottom">
                        <IconShieldCheck size={17} />
                        <span>Akses terlindungi untuk tim internal</span>
                        <span className="story-version">v1.0</span>
                    </div>
                </section>

                <section className="login-panel">
                    <div className="login-form-wrap animate-enter">
                        <div className="login-mobile-brand">
                            <span className="brand-mark"><IconApps size={21} /></span>
                            <strong>Ruang Aset</strong>
                        </div>
                        <p className="eyebrow">SELAMAT DATANG KEMBALI</p>
                        <h2 className="font-display">Masuk ke ruang kerja</h2>
                        <p className="login-instructions">Gunakan akun internal Anda untuk melanjutkan.</p>

                        <form onSubmit={submit} className="login-form">
                            <div className="idds-field">
                                <TextField
                                    label="Alamat email"
                                    type="email"
                                    value={data.email}
                                    onChange={(value) => setData('email', value)}
                                    placeholder="nama@instansi.go.id"
                                    autoComplete="username"
                                    status={errors.email ? 'error' : 'neutral'}
                                    statusMessage={errors.email}
                                    showClearButton={false}
                                />
                            </div>
                            <div className="idds-field">
                                <PasswordInput
                                    label="Kata sandi"
                                    value={data.password}
                                    onChange={(value) => setData('password', value)}
                                    placeholder="Masukkan kata sandi"
                                    autoComplete="current-password"
                                    status={errors.password ? 'error' : 'neutral'}
                                    statusMessage={errors.password}
                                />
                            </div>
                            <label className="remember-control">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(event) => setData('remember', event.target.checked)}
                                />
                                <span>Ingat sesi saya</span>
                            </label>
                            <Button type="submit" hierarchy="primary" size="lg" disabled={processing} suffixIcon={<IconArrowNarrowRight size={18} />}>
                                {processing ? 'Memeriksa akses…' : 'Masuk ke aplikasi'}
                            </Button>
                        </form>

                        <div className="login-secure-note">
                            <IconLock size={16} />
                            <span>Sesi aman dengan perlindungan verifikasi dan pembatasan percobaan masuk.</span>
                        </div>
                        <p className="login-help">Tidak memiliki akun? Hubungi administrator sistem.</p>
                    </div>
                    <div className="login-panel-footer"><span>Ruang Aset</span><span>Pengelolaan aset TI · Indonesia</span></div>
                </section>
            </main>
        </>
    );
}
