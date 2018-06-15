import { FieldName } from 'src/client/interfaces';

export const monetary: FieldName[] = ['price', 'marketCap'];

export const numerical: FieldName[] = ['Rank'];

export const defaultOrder: FieldName[] = ['Logo', 'Rank', 'Name', 'Symbol', 'Category', 'trading', ...monetary];
