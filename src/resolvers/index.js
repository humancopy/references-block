import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { requestConfluence } from '@forge/bridge';

const resolver = new Resolver();

(() => {
  const getConfig = (context, payload) => {
    return {...(payload?.defaultConfig || {}), ...(context.extension.config || {})};
  };

  resolver.define('getConfig', ({context, payload}) => {
    return getConfig(context, payload);
  });

  resolver.define('getLinks', async ({context, payload}) => {
    const contentId = context.extension.content.id;
    const spaceKey = context.extension.space.key;

    const res = await api.asApp().requestConfluence(route`/wiki/api/v2/pages/${contentId}?body-format=VIEW`);
    const data = await res.json();
    const htmlString = data?.body?.view?.value || '';

    if (!data || data?.errors || !htmlString) {
      return ["error"];
    }

    const jsdom = require("jsdom");
    const dom = new jsdom.JSDOM(htmlString);
    const doc = dom.window.document;

    const config = getConfig(context, payload);

    const selectors = [];

    if (config.extractLinks.includes("external")) {
      selectors.push('a[href^="http"]');
    }
    if (config.extractLinks.includes("ftp")) {
      selectors.push('a[href^="ftp"]', 'a[href^="sftp"]');
    }
    if (config.extractLinks.includes("internal")) {
      selectors.push('a[href^="/"]');
    }
    if (config.extractLinks.includes("emails")) {
      selectors.push('a[href^="mailto:"]');
    }

    const selector = selectors.join(',');
    if (!selector) {
      return [];
    }

    const results = Array.from(doc.querySelectorAll(selector))
      .filter((link) => {
        return !link.href.match(`spaces/${spaceKey}/pages/(.+/)?${contentId}`);
      })
      .map((link) => ({
        text: link.text,
        href: link.href,
      })
    );

    return config.uniqueLinks != "yes" ? results : results.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.href === value.href
      ))
    );
  });
})();

export const handler = resolver.getDefinitions();
