import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, DynamicTable, Link, Label, Textfield } from '@forge/react';
import { view, invoke } from '@forge/bridge';

export const head = {
  cells: [
    {
      key: "name",
      content: "Name",
      isSortable: true,
    },
    {
      key: "link",
      content: "Link",
      isSortable: false,
    },
  ],
};

const defaultConfig = {
  table_title: 'References',
  empty_text: 'No links found'
};

const Config = () => {
  return (
    <>
      <Label>Table title</Label>
      <Textfield name="table_title" defaultValue={defaultConfig.table_title} />
      <Label>Empty text</Label>
      <Textfield name="empty_text" defaultValue={defaultConfig.empty_text} />
    </>
  );
};

const App = () => {
  const [context, setContext] = useState(undefined);
  const [rows, setRows] = useState(null);

  useEffect(() => {
    view.getContext().then(setContext);

    invoke("getLinks")
      .then((links) => setRows(
        links.map((link, index) => ({
          key: `row-${index}`,
          cells: [
            {
              key: `link-name-${index}`,
              content: link.text.trim() || '---',
            },
            {
              key: `link-href-${index}`,
              content: <Link href={link.href}>{link.href}</Link>,
            }
          ]
        }))
      ))
      .catch((err) => console.error("Failed!", err))
    ;
  }, []);

  const config = context?.extension.config || defaultConfig;
  const table_title = config?.table_title;
  const empty_text = config?.empty_text;

  return (
    <>
      <DynamicTable
        caption={table_title}
        isLoading={rows ? false : true}
        head={head}
        rows={rows}
        emptyView={empty_text}
      />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
