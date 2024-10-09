import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, DynamicTable, Link, Label, Textfield, CheckboxGroup, RadioGroup } from '@forge/react';
import { view, invoke } from '@forge/bridge';
import { defaultConfig } from '../Constants';
import { trimString } from '../Functions';
import Config from '../Config';

const App = () => {
  const [context, setContext] = useState(undefined);
  const [rows, setRows] = useState(null);
  const [emptyText, setEmptyText] = useState(null);
  const [config, setConfig] = useState(null);

  const cells = config?.tableStyle == "double" ? [
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
  ] : [
    {
      key: "link",
      content: "",
      isSortable: false,
    },
  ];

  const head = {
    cells: cells,
  };

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
