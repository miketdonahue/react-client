declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}

declare namespace config {
  interface Config {
    server: object;
  }
}
