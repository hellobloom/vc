export const sitemap = {
  home: '/',
  claim: (id: string) => `/claim/${id}`,
  share: (id: string) => `/share/${id}`,
  admin: {
    home: '/admin',
    issue: '/admin/issue',
    request: '/admin/request',
  }
}
