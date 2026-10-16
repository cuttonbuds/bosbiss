// Field definitions that drive the dashboard forms.
// type: text | textarea | tags | date | number | bool | image | file

export const PROFILE_FIELDS = [
  { group: 'Hero' },
  { name: 'name', label: 'Name' },
  { name: 'photo_url', label: 'Profile photo', type: 'image', hint: 'Square photo works best; shown in About' },
  { name: 'eyebrow', label: 'Eyebrow labels', type: 'tags', hint: 'Comma separated, shown above the headline' },
  { name: 'headline_1', label: 'Headline line 1' },
  { name: 'headline_2', label: 'Headline line 2' },
  { name: 'headline_3', label: 'Headline line 3', hint: 'Rendered in muted color' },
  { name: 'lede', label: 'Intro paragraph', type: 'textarea' },
  { name: 'status_text', label: 'Status pill', hint: 'Leave empty to hide' },

  { group: 'Contact buttons' },
  { name: 'whatsapp', label: 'WhatsApp number', hint: 'International format without +, e.g. 62812xxxxxxx. Leave empty to hide the button' },
  { name: 'cv_url', label: 'CV / resume', type: 'file', hint: 'Upload a PDF or paste a link. Leave empty to hide the button' },
  { name: 'email', label: 'Email' },

  { group: 'About' },
  { name: 'about_1', label: 'Paragraph 1', type: 'textarea' },
  { name: 'about_2', label: 'Paragraph 2', type: 'textarea' },
  { name: 'location', label: 'Location' },
  { name: 'role', label: 'Role' },
  { name: 'focus', label: 'Focus' },
  { name: 'stack', label: 'Stack' },

  { group: 'Section intros' },
  { name: 'products_lede', label: 'Products intro', type: 'textarea' },
  { name: 'products_callout_title', label: 'Products callout title' },
  { name: 'products_callout_text', label: 'Products callout text', type: 'textarea' },
  { name: 'projects_lede', label: 'Projects intro', type: 'textarea' },
  { name: 'articles_lede', label: 'Articles intro', type: 'textarea' },

  { group: 'Contact & footer' },
  { name: 'contact_lede', label: 'Contact intro', type: 'textarea' },
  { name: 'footer_left', label: 'Footer left', hint: '© is replaced with © + current year' },
  { name: 'footer_right', label: 'Footer right' },
];

const common = [
  { name: 'sort_order', label: 'Order', type: 'number', width: 'sm' },
  { name: 'published', label: 'Published', type: 'bool', width: 'sm' },
];

export const COLLECTIONS = [
  {
    table: 'services', label: 'What I do', titleField: 'title',
    fields: [
      { name: 'key', label: 'Letter', width: 'sm', hint: 'A, B, C…' },
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
      ...common,
    ],
  },
  {
    table: 'products', label: 'Products', titleField: 'title',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'price_label', label: 'Price label', width: 'sm', hint: 'e.g. Rp 30.000' },
      { name: 'url', label: 'Buy link' },
      ...common,
    ],
  },
  {
    table: 'projects', label: 'Projects', titleField: 'title',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'image_url', label: 'Thumbnail', type: 'image', hint: 'Screenshot of the project, 16:9 works best' },
      { name: 'description', label: 'Short description', type: 'textarea' },
      { name: 'details', label: 'Case study', type: 'textarea', hint: 'Optional. Problem, solution, result. Blank line = new paragraph' },
      { name: 'tags', label: 'Stack tags', type: 'tags', hint: 'Comma separated' },
      { name: 'year', label: 'Year', width: 'sm' },
      { name: 'url', label: 'Demo / repo link' },
      ...common,
    ],
  },
  {
    table: 'articles', label: 'Articles', titleField: 'title',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Summary', type: 'textarea' },
      { name: 'url', label: 'Link' },
      { name: 'published_on', label: 'Published on', type: 'date', width: 'sm' },
      ...common,
    ],
  },
  {
    table: 'testimonials', label: 'Testimonials', titleField: 'author',
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea' },
      { name: 'author', label: 'Author' },
      { name: 'role', label: 'Role / company', hint: 'e.g. Owner, Toko Maju' },
      ...common,
    ],
  },
  {
    table: 'social_links', label: 'Social', titleField: 'label',
    fields: [
      { name: 'label', label: 'Label', width: 'sm' },
      { name: 'url', label: 'URL' },
      ...common,
    ],
  },
];

/** Empty row with sensible defaults for a collection. */
export function blankRow(config, nextOrder) {
  const row = {};
  config.fields.forEach((f) => {
    if (f.type === 'tags') row[f.name] = [];
    else if (f.type === 'bool') row[f.name] = true;
    else if (f.type === 'number') row[f.name] = nextOrder;
    else if (f.type === 'date') row[f.name] = null;
    else row[f.name] = '';
  });
  return row;
}
