import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    primary: Primary;
    neutrals: Neutrals;
    supporting: Supporting;
  }
}

export interface Neutrals {
  "cool-grey-050": string;
  "cool-grey-100": string;
  "cool-grey-200": string;
  "cool-grey-300": string;
  "cool-grey-400": string;
  "cool-grey-500": string;
  "cool-grey-600": string;
  "cool-grey-700": string;
  "cool-grey-800": string;
  "cool-grey-900": string;
}

export interface Primary {
  "indigo-020": string;
  "indigo-050": string;
  "indigo-100": string;
  "indigo-200": string;
  "indigo-300": string;
  "indigo-400": string;
  "indigo-500": string;
  "indigo-600": string;
  "indigo-700": string;
  "indigo-800": string;
  "indigo-900": string;
  "orange-vivid-050": string;
  "orange-vivid-100": string;
  "orange-vivid-200": string;
  "orange-vivid-300": string;
  "orange-vivid-400": string;
  "orange-vivid-500": string;
  "orange-vivid-600": string;
  "orange-vivid-700": string;
  "orange-vivid-800": string;
  "orange-vivid-900": string;
}

export interface Supporting {
  "magenta-vivid-050": string;
  "magenta-vivid-100": string;
  "magenta-vivid-200": string;
  "magenta-vivid-300": string;
  "magenta-vivid-400": string;
  "magenta-vivid-500": string;
  "magenta-vivid-600": string;
  "magenta-vivid-700": string;
  "magenta-vivid-800": string;
  "magenta-vivid-900": string;
  "red-vivid-050": string;
  "red-vivid-100": string;
  "red-vivid-200": string;
  "red-vivid-300": string;
  "red-vivid-400": string;
  "red-vivid-500": string;
  "red-vivid-600": string;
  "red-vivid-700": string;
  "red-vivid-800": string;
  "red-vivid-900": string;
  "yellow-vivid-050": string;
  "yellow-vivid-100": string;
  "yellow-vivid-200": string;
  "yellow-vivid-300": string;
  "yellow-vivid-400": string;
  "yellow-vivid-500": string;
  "yellow-vivid-600": string;
  "yellow-vivid-700": string;
  "yellow-vivid-800": string;
  "yellow-vivid-900": string;
  "green-vivid-050": string;
  "green-vivid-100": string;
  "green-vivid-200": string;
  "green-vivid-300": string;
  "green-vivid-400": string;
  "green-vivid-500": string;
  "green-vivid-600": string;
  "green-vivid-700": string;
  "green-vivid-800": string;
  "green-vivid-900": string;
}
