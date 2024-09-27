import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { requestConfluence } from '@forge/bridge';

const resolver = new Resolver();

resolver.define('getLinks', async (req) => {
  const contentId = req.context.extension.content.id;
  const payload = req.payload;

  const res = await api.asApp().requestConfluence(route`/wiki/api/v2/pages/${contentId}?body-format=VIEW`);
  const data = await res.json();
  const htmlString = data.body.view.value;

  const jsdom = require("jsdom");
  const dom = new jsdom.JSDOM(htmlString);
  const doc = dom.window.document;

  const config = req.context.extension.config || payload.defaultConfig;

  const selectors = [];

  if (config.extract.includes("external")) {
    selectors.push('a[href^="http"]', 'a[href^="ftp"]', 'a[href^="sftp"]');
  }
  if (config.extract.includes("ftp")) {
    selectors.push('a[href^="ftp"]', 'a[href^="sftp"]');
  }
  if (config.extract.includes("internal")) {
    selectors.push('a[href^="/"]');
  }
  if (config.extract.includes("emails")) {
    selectors.push('a[href^="mailto:"]');
  }

  const selector = selectors.join(',');
  if (!selector) {
    return [];
  }

  return Array.from(doc.querySelectorAll(selector)).map((link) => ({
    text: link.text,
    href: link.href,
  }));
});

export const handler = resolver.getDefinitions();
