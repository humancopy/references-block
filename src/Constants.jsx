export const MAX_TITLE_LENGTH = 35;

export const extractLinksOptions = [
  { value: "external", label: "External" },
  { value: "internal", label: "Internal" },
  { value: "ftp", label: "(S)FTP" },
  { value: "emails", label: "Emails" },
];

export const uniqueLinksOptions = [
  { name: "uniqueLinks", value: "yes", label: "Yes" },
  { name: "uniqueLinks", value: "no", label: "No" },
];

export const tableStyleOptions = [
  { name: "tableStyle", value: "single", label: "Single column" },
  { name: "tableStyle", value: "double", label: "Separate columns" },
];

export const defaultConfig = {
  tableTitle: "References",
  emptyText: "No links found",
  errorText: "There was an error fetching links",
  extractLinks: ["external", "internal", "ftp"],
  uniqueLinks: "yes",
  tableStyle: "single",
};
