import { ICryptoAsset } from 'src/client/interfaces';

export interface IAppState {
  coins: ICryptoAsset[];
  loading: boolean;
}

const initialState: IAppState = {
  coins: [],
  loading: true
};

export default initialState;
