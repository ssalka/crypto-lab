import { CurrencyCode, ProjectName } from './crypto';

interface IAirtableLogo {
  id: string;
  url: string;
}

interface IAirtableThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface IAirtableAttachment {
  filename: string;
  id: string;
  size: number;
  thumbnails?: Record<'large' | 'small', IAirtableThumbnail>;
  type: string;
  url: string;
}

export interface IAirtableCoin {
  Blockchain: string[];
  Bookmarks: string[];
  Category: string;
  'Consensus Mechanism': string;
  Contributors: string[];
  Favorites: boolean;
  Features: string[];
  'Fork(s)': string[];
  Industry: string;
  Links: string;
  'Listed On': string[];
  Location: string;
  Logo: IAirtableLogo[];
  Name: ProjectName;
  Notes: string;
  'Official Website': string;
  Premise: string;
  Rank: number;
  'Related Actors': string[];
  Stage: string;
  Symbol: CurrencyCode;
  Tags: string[];
  Type: string;
  Whitepapers: IAirtableAttachment[];
  'Written In': string[];
}

export interface INormalizedAirtableCoin {
  blockchain: string[];
  bookmarks: string[];
  category: string;
  consensusAlgorithm: string;
  contributors: string[];
  favorites: boolean;
  features: string[];
  forks: string[];
  industry: string;
  links: string;
  listedOn: string[];
  location: string;
  logo: string;
  name: ProjectName;
  notes: string;
  officialWebsite: string;
  premise: string;
  rank: number;
  relatedActors: string[];
  stage: string;
  symbol: CurrencyCode;
  tags: string[];
  type: string;
  whitepapers: IAirtableAttachment[];
  writtenIn: string[];
}

export interface IAirtableEntity {
  ID: string;
  Name: string;
  Cryptocurrency: IAirtableCoin;
}
