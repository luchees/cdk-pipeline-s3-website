type configType = {
  [k: string]: websiteConfig;
};
export type websiteConfig = {
  folder: string;
  url: string;
};
export const config: configType = {
  "portfolio-website": {
    folder: "website",
    url: "www.lucas.com",
  },
};
