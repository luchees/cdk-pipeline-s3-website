type configType = {
  [k: string]: WebsiteConfig;
};
export type WebsiteConfig = {
  folder: string;
  url: string;
  domainName: string;
};
export const config: configType = {
  'portfolio-website': {
    folder: 'portfolio',
    url: 'lvda.link',
    domainName: 'lvda.link'
  }
};

export const githubConfig = {
  owner: 'luchees',
  repo: 'cdk-pipeline-s3-website',
  branch: 'main'
};

export const awsEnv = {
  accoung: '365201099929',
  region: 'eu-west-1'
};
