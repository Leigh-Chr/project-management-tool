export function findEntityById<T extends { id: number }>(
  entities: T[],
  id: number,
  entityName: string
): T {
  const entity = entities.find((e) => e.id === id);
  if (!entity) {
    throw new Error(`${entityName} not found`);
  }
  return entity;
}

export function filterEntitiesByField<T, K extends keyof T>(
  entities: T[],
  fieldName: K,
  value: T[K]
): T[] {
  return entities.filter((entity) => entity[fieldName] === value);
}

export function mapEntities<T, U>(entities: T[], mapFn: (entity: T) => U): U[] {
  return entities.map(mapFn);
}
