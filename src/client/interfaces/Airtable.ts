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
  'Whitepaper(s)': IAirtableAttachment[];
  'Written In': string[];
}
