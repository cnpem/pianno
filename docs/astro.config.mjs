import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://matyson.github.io',
  base: '/pianno',
  integrations: [
    starlight({
      title: 'Pianno',
      favicon: './src/assets/favicon.svg',
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
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', link: '/guides/example/' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
      customCss: ['./src/tailwind.css'],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
