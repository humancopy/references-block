import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, DynamicTable } from '@forge/react';
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
    invoke('getLinks').then(setRows).catch((err) => console.error("Failed!", err));
  }, []);

  return (
    <>
      { rows ?
        (
          <DynamicTable
            caption="List of links"
            head={head}
            rows={rows}
          />
        ) : (
          <Text>Loading...</Text>
        )
      }
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
