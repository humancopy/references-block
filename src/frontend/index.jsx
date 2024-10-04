import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, DynamicTable, Link, Label, Textfield, CheckboxGroup } from '@forge/react';
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

const extract_options = [
  { value: "external", label: "External" },
  { value: "internal", label: "Internal" },
  { value: "ftp", label: "(S)FTP" },
  { value: "emails", label: "Emails" },
];

const defaultConfig = {
  table_title: "References",
  empty_text: "No links found",
  error_text: "There was an error fetching links",
  extract: ["external", "internal", "ftp"],
};

const Config = () => {
  return (
    <>
      <Label>Table title</Label>
      <Textfield name="table_title" defaultValue={defaultConfig.table_title} />
      <Label>Empty text</Label>
      <Textfield name="empty_text" defaultValue={defaultConfig.empty_text} />
      <Label>Which links to extract?</Label>
      <CheckboxGroup name="extract" options={extract_options} defaultValue={defaultConfig.extract} />
    </>
  );
};

const App = () => {
  const [context, setContext] = useState(undefined);
  const [rows, setRows] = useState(null);
  const [empty_text, setEmptyText] = useState(null);

  useEffect(() => {
    view.getContext().then(setContext);

    invoke("getLinks", {defaultConfig: defaultConfig})
      .then((links) => {
        if (links[0] == "error") {
          setEmptyText(defaultConfig.error_text);
          setRows([]);
        } else {
          setEmptyText(config?.empty_text || defaultConfig.empty_text);

          setRows(
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
          )
        }
      })
      .catch((err) => console.error("Failed!", err))
    ;
  }, []);

  const config = context?.extension.config || defaultConfig;
  const table_title = config?.table_title;

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
