export const enum EntityAction {
  LoadAll = 'LOAD_ENTITIES'
}

export interface IEntityAction {
  type: EntityAction;
}
