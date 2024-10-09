import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, DynamicTable, Link, Label, Textfield, CheckboxGroup, RadioGroup } from '@forge/react';
import { view, invoke } from '@forge/bridge';

const MAX_TITLE_LENGTH = 35;

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

const tableStyleOptions = [
  { name: "tableStyle", value: "single", label: "Single column" },
  { name: "tableStyle", value: "double", label: "Separate columns" },
];

const defaultConfig = {
  tableTitle: "References",
  emptyText: "No links found",
  errorText: "There was an error fetching links",
  extractLinks: ["external", "internal", "ftp"],
  uniqueLinks: "yes",
  tableStyle: "single",
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
      <Label>Table style</Label>
      <RadioGroup name="tableStyle" options={tableStyleOptions} defaultValue={defaultConfig.tableStyle} />
    </>
  );
};

const trimString = (string) => {
  string = string.trim();
  return string.length > MAX_TITLE_LENGTH ? `${string.substring(0, MAX_TITLE_LENGTH - 3)}...` : string;
};

const App = () => {
  const [context, setContext] = useState(undefined);
  const [rows, setRows] = useState(null);
  const [emptyText, setEmptyText] = useState(null);
  const [config, setConfig] = useState(null);

  const head = {
    cells: [
      {
        key: "link",
        content: "Link",
        isSortable: false,
      },
    ],
  };

  if (config?.tableStyle == "double") {
    head.cells.unshift({
      key: "name",
      content: "Name",
      isSortable: true,
    });
  }

  useEffect(() => {
    view.getContext().then(setContext);

    invoke("getConfig", {defaultConfig: defaultConfig})
      .then((config) => {
        setConfig(config);

        setEmptyText(config?.emptyText || defaultConfig.emptyText);

        invoke("getLinks", {defaultConfig: defaultConfig})
          .then((links) => {
            if (links[0] == "error") {
              setEmptyText(defaultConfig.errorText);
              setRows([]);
            } else {
              setEmptyText(config?.emptyText || defaultConfig.emptyText);
              const tableStyle = config?.tableStyle;

              setRows(
                links.map((link, index) => {
                  const result = {
                    key: `row-${index}`,
                    cells: [
                      {
                        key: `link-href-${index}`,
                        content: <Link href={link.href}>{tableStyle == "double" ? trimString(link.href) : trimString(link.text)}</Link>,
                      }
                    ],
                  };

                  if (tableStyle == "double") {
                    result.cells.unshift({
                      key: `link-name-${index}`,
                      content: trimString(link.text) || '---',
                    });
                  }

                  return result;
                })
              )
            }
          })
          .catch((err) => console.error("Failed!", err))
        ;
      });

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
