declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;

  export = value;
}
