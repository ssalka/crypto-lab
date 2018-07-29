import _ from 'lodash/fp';
import { Fetch, IAirtableEntity } from 'src/client/interfaces';

export const loadEntities: Fetch<IAirtableEntity[]> = () => {
  return fetch('/airtable/entities').then(_.invoke('json'));
};
