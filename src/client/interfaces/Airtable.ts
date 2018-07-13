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
  'Buy Target': string;
  Category: string;
  'Consensus Mechanism': string;
  Contributors: string[];
  'Date Added': string;
  Favorites: boolean;
  Features: string[];
  'Fork(s)': string[];
  HODL: boolean;
  Industry: string;
  Joined: boolean;
  Links: string;
  'Listed On': string[];
  Location: string;
  Logo: IAirtableLogo[];
  'Market Cap': string;
  Name: ProjectName;
  'Not Getting Any Time Soon': boolean;
  Notes: string;
  'Official Website': string;
  'Potential Project Element': boolean;
  Premise: string;
  Rank: number;
  'Reasons to Like': string[];
  'Related Actors': string[];
  'Second Top 5': boolean;
  Stage: string;
  Symbol: CurrencyCode;
  Tags: string[];
  'Top 5': boolean;
  'Trading Notes': string[];
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
  reasonsToLike: string[];
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
