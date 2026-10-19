import '@idds/react/index.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/newsreader/500.css';
import '@fontsource/newsreader/600.css';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { setBrandTheme } from '@idds/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

setBrandTheme('inagov');

createInertiaApp({
    title: (title) => `${title} · Ruang Aset`,
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx'),
    ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#176c54',
    },
});
