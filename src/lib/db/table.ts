export interface TableInput {
  name: string
  columns: readonly string[]
}

export function getTable<T extends TableInput>(
  table: T,
): {
  name: T['name']
  columns: {
    [K in T['columns'][number]]: K
  }
} {
  const columns: {
    [K in T['columns'][number]]: K
  } = {} as any

  for (const key of table.columns) {
    ;(columns as any)[key] = key
  }

  return {
    name: table.name,
    columns,
  }
}
