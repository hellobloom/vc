const bloom = 'https://bloom.co'

module.exports = {
  title: 'VC Data | Bloom Documentation',
  tagline: 'The tagline of my site',
  url: bloom,
  baseUrl: '/documentation/vc-data/',
  favicon: 'img/favicon.png',
  organizationName: 'hellobloom',
  projectName: 'vc',
  themeConfig: {
    navbar: {
      title: 'Bloom',
      logo: {
        alt: 'Bloom',
        src: 'img/logo.svg',
        href: 'https://bloom.co/documentation/',
        target: '_self',
      },
      links: [
        {
          href: 'https://github.com/hellobloom/vc',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Company',
          items: [
            {
              label: 'About Us',
              to: `${bloom}/about`,
            },
            {
              label: 'Blog',
              to: `${bloom}/blog`,
            },
            {
              label: 'White Paper',
              to: `${bloom}/whitepaper.pdf`,
            },
            {
              label: 'Careers',
              to: `${bloom}/careers`,
            },
            {
              label: 'Contact Us',
              to: 'mailto:support@bloom.co',
            },
            {
              label: 'Smart Token',
              to: `${bloom}/token`,
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Telegram',
              href: 'https://t.me/bloomprotocol',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/bloom',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/bloomtoken',
            },
            {
              label: 'Reddit',
              href: 'https://www.reddit.com/r/BloomToken',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/c/bloomprotocol',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/Dgk2shG',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              to: `${bloom}/legal/privacy`,
            },
            {
              label: 'Terms of Service',
              to: `${bloom}/legal/terms`,
            },
            {
              label: 'Cookie Policy',
              to: `${bloom}/legal/cookies`,
            },
            {
              label: 'Affiliate Disclosures',
              to: `${bloom}/legal/affiliate-disclosures`,
            },
          ],
        },
      ],
      logo: {
        src: 'img/logowithtext.svg',
        alt: 'Bloom',
      },
      copyright: `Copyright © Bloom Protocol, Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
