import { CurrencyCode, ProjectCategory, ProjectName, ProjectType } from './crypto';

interface IAirtableLogo {
  id: string;
  url: string;
}

export interface IAirtableCoin {
  Blockchain: string[];
  Bookmarks: string[];
  'Buy Target': string;
  Category: ProjectCategory;
  'Date Added': string;
  Favorites: boolean;
  Features: string[];
  HODL: boolean;
  Industry: string;
  Joined: boolean;
  Links: string;
  'Listed On': string[];
  Location: string;
  Logo: IAirtableLogo[];
  'Market Cap': string;
  Name: ProjectName;
  Notes: string;
  'Official Website': string;
  'Potential Project Element': boolean;
  Premise: string;
  Rank: number;
  'Reasons to Like': string[];
  'Related Actors': string[];
  Stage: string;
  Symbol: CurrencyCode;
  'Top 5': boolean;
  Type: ProjectType;
}

// export interface ICoinMarketCapSchema {
//   marketCap: number;
//   price: number;
// }
//
