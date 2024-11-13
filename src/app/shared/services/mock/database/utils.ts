export function findEntityById<T extends { id: number }>(
  entities: T[],
  id: number
): T | null {
  const entity = entities.find((e) => e.id === id);
  if (!entity) return null;
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
