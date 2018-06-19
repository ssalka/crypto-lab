import { FieldName } from 'src/client/interfaces';

export const image: FieldName[] = ['logo'];

export const monetary: FieldName[] = ['price', 'marketCap'];

export const numerical: FieldName[] = ['rank'];

export const defaultOrder: FieldName[] = [...image, 'rank', 'name', 'symbol', 'category', 'trading', ...monetary];
