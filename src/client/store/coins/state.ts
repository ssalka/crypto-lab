import { ICryptoAsset } from 'src/client/interfaces';

export interface ICoinsState {
  all: ICryptoAsset[];
  loading: boolean;
}

const initialState: ICoinsState = {
  all: [],
  loading: true
};

export default initialState;
