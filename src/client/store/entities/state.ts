import { IAirtableEntity } from 'src/client/interfaces';

export interface IEntityState {
  all: IAirtableEntity[];
  loading: boolean;
}

const initialState: IEntityState = {
  all: [],
  loading: true
};

export default initialState;
