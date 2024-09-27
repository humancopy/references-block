import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, DynamicTable, Link } from '@forge/react';
import { invoke } from '@forge/bridge';

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

const App = () => {
  const [rows, setRows] = useState(null);

  useEffect(() => {
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

  return (
    <>
      <DynamicTable
        caption="List of links"
        isLoading={rows ? false : true}
        head={head}
        rows={rows}
        emptyView="No links found"
      />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
