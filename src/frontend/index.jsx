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

const extractOptions = [
  { value: "external", label: "External" },
  { value: "internal", label: "Internal" },
  { value: "ftp", label: "(S)FTP" },
  { value: "emails", label: "Emails" },
];

const defaultConfig = {
  tableTitle: "References",
  emptyText: "No links found",
  errorText: "There was an error fetching links",
  extract: ["external", "internal", "ftp"],
};

const Config = () => {
  return (
    <>
      <Label>Table title</Label>
      <Textfield name="tableTitle" defaultValue={defaultConfig.tableTitle} />
      <Label>Empty text</Label>
      <Textfield name="emptyText" defaultValue={defaultConfig.emptyText} />
      <Label>Which links to extract?</Label>
      <CheckboxGroup name="extract" options={extractOptions} defaultValue={defaultConfig.extract} />
    </>
  );
};

const App = () => {
  const [context, setContext] = useState(undefined);
  const [rows, setRows] = useState(null);
  const [emptyText, setEmptyText] = useState(null);

  useEffect(() => {
    view.getContext().then(setContext);

    invoke("getLinks", {defaultConfig: defaultConfig})
      .then((links) => {
        if (links[0] == "error") {
          setEmptyText(defaultConfig.errorText);
          setRows([]);
        } else {
          setEmptyText(config?.emptyText || defaultConfig.emptyText);

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
  const tableTitle = config?.tableTitle;

  return (
    <>
      <DynamicTable
        caption={tableTitle}
        isLoading={rows ? false : true}
        head={head}
        rows={rows}
        emptyView={emptyText}
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
