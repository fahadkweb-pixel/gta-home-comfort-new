// This defines how the document types are listed in the Studio
export const structure = (S) =>
  S.list()
    .title('Content Dashboard')
    .items([
      // 1. SINGLETONS (One-off pages that shouldn't be duplicated)
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('settings')),
      S.divider(),

      S.listItem()
        .title('Home Page')
        .child(S.document().schemaType('homepage').documentId('homepage')),

      S.listItem()
        .title('About Page')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),

      S.listItem()
        .title('Contact Page')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),

      S.divider(),

      // 2. DYNAMIC PAGES (Lists)
      S.documentTypeListItem('servicePage').title('Service Pages'),

      S.divider(),

      // 3. DATA COLLECTIONS
      S.documentTypeListItem('review').title('Customer Reviews'),
      S.documentTypeListItem('tile').title('Homepage Tiles'),
    ]);
