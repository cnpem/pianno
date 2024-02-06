import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://matyson.github.io',
  base: '/pianno',
  integrations: [
    starlight({
      title: 'pianno',
      logo: {
        light: './src/assets/logo-semibold.svg',
        dark: './src/assets/logo-semibold-dark.svg',
      },
      components: {
        SocialIcons: './src/components/app.astro',
      },
      social: {
        github: 'https://github.com/matyson/pianno',
      },
      sidebar: [
        {
          label: 'User Guide',
          autogenerate: {
            directory: 'guides',
          },
        },
        {
          label: 'Reference',
          badge: {
            text: 'to do',
            variant: 'caution',
          },
          autogenerate: {
            directory: 'reference',
          },
        },
      ],
      customCss: ['./src/styles/globals.css'],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
});
