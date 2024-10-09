import React from 'react';
import { Text, DynamicTable, Link, Label, Textfield, CheckboxGroup, RadioGroup } from '@forge/react';
import { defaultConfig, extractLinksOptions, uniqueLinksOptions, tableStyleOptions } from './Constants';

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

export default Config;
