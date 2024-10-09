import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, DynamicTable, Link, Label, Textfield, CheckboxGroup, RadioGroup } from '@forge/react';
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

const extractLinksOptions = [
  { value: "external", label: "External" },
  { value: "internal", label: "Internal" },
  { value: "ftp", label: "(S)FTP" },
  { value: "emails", label: "Emails" },
];

const uniqueLinksOptions = [
  { name: "uniqueLinks", value: "yes", label: "Yes" },
  { name: "uniqueLinks", value: "no", label: "No" },
];

const defaultConfig = {
  tableTitle: "References",
  emptyText: "No links found",
  errorText: "There was an error fetching links",
  extractLinks: ["external", "internal", "ftp"],
  uniqueLinks: "yes",
};

const Config = () => {
  return (
    <>
      <Label>Table title</Label>
      <Textfield name="tableTitle" defaultValue={defaultConfig.tableTitle} />
      <Label>Empty text</Label>
      <Textfield name="emptyText" defaultValue={defaultConfig.emptyText} />
      <Label>Which links to extract?</Label>
      <CheckboxGroup name="extractLinks" options={extractLinksOptions} defaultValue={defaultConfig.extractLinks} />
      <Label>Remove duplicate links?</Label>
      <RadioGroup name="uniqueLinks" options={uniqueLinksOptions} defaultValue={defaultConfig.uniqueLinks} />
    </>
  );
};

const App = () => {
  const [context, setContext] = useState(undefined);
  const [rows, setRows] = useState(null);
  const [emptyText, setEmptyText] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    view.getContext().then(setContext);

    invoke("getConfig", {defaultConfig: defaultConfig})
      .then(setConfig);

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

  return (
    <>
      <DynamicTable
        caption={config?.tableTitle}
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
