import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { requestConfluence } from '@forge/bridge';

const resolver = new Resolver();

resolver.define('getLinks', async (req) => {
  const contentId = req.context.extension.content.id;

  const res = await api.asApp().requestConfluence(route`/wiki/api/v2/pages/${contentId}?body-format=VIEW`);
  const data = await res.json();
  const htmlString = data.body.view.value;

  const jsdom = require("jsdom");
  const dom = new jsdom.JSDOM(htmlString);
  const doc = dom.window.document;

  const links = doc.querySelectorAll('a[href*="http"], a[href*="/"]');

  return Array.from(links).map((link, index) => ({
    key: `row-${index}`,
    cells: [
      {
        key: `link-name-${index}`,
        content: link.text.trim() || '---',
      },
      {
        key: `link-href-${index}`,
        content: link.href,
      }
    ]
  }));
});

export const handler = resolver.getDefinitions();
