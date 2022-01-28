import { RelValue } from '../transaction/types';

export type QueryInput = {
  name: string;
  value: RelValue;
};

export type CsvConfigSyntax = {
  header?: {
    [colNumber: string]: string;
  };
  header_row?: number;
  delim?: string;
  quotechar?: string;
  escapechar?: string;
};

export type CsvConfigSchema = {
  [colName: string]: string;
};
