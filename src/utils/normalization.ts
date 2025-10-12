// Утилиты для нормализации данных
export interface NormalizedState<T> {
  byId: Record<string, T>;
  allIds: string[];
}

export interface NormalizedResponse<T> {
  entities: NormalizedState<T>;
  result: string[];
}

// Нормализация массива объектов в объект с ключами по ID
export const normalizeArray = <T extends { id: string }>(
  array: T[]
): NormalizedState<T> => {
  const byId: Record<string, T> = {};
  const allIds: string[] = [];

  array.forEach(item => {
    byId[item.id] = item;
    allIds.push(item.id);
  });

  return { byId, allIds };
};

// Денормализация нормализованного состояния обратно в массив
export const denormalizeState = <T>(state: NormalizedState<T>): T[] => {
  return state.allIds.map(id => state.byId[id]);
};

// Обновление элемента в нормализованном состоянии
export const updateEntity = <T extends { id: string }>(
  state: NormalizedState<T>,
  id: string,
  updates: Partial<T>
): NormalizedState<T> => {
  if (!state.byId[id]) {
    return state;
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        ...state.byId[id],
        ...updates,
      },
    },
  };
};

// Добавление нового элемента в нормализованное состояние
export const addEntity = <T extends { id: string }>(
  state: NormalizedState<T>,
  entity: T
): NormalizedState<T> => {
  if (state.byId[entity.id]) {
    return state; // Элемент уже существует
  }

  return {
    byId: {
      ...state.byId,
      [entity.id]: entity,
    },
    allIds: [...state.allIds, entity.id],
  };
};

// Удаление элемента из нормализованного состояния
export const removeEntity = <T extends { id: string }>(
  state: NormalizedState<T>,
  id: string
): NormalizedState<T> => {
  if (!state.byId[id]) {
    return state;
  }

  const { [id]: _, ...byId } = state.byId;
  const allIds = state.allIds.filter(entityId => entityId !== id);

  return { byId, allIds };
};

// Селекторы для нормализованного состояния
export const selectEntityById = <T>(state: NormalizedState<T>, id: string): T | undefined => {
  return state.byId[id];
};

export const selectEntitiesByIds = <T>(state: NormalizedState<T>, ids: string[]): T[] => {
  return ids.map(id => state.byId[id]).filter(Boolean);
};

export const selectAllEntities = <T>(state: NormalizedState<T>): T[] => {
  return denormalizeState(state);
};

// Утилиты для работы с пагинацией
export interface PaginatedState<T> extends NormalizedState<T> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const createPaginatedState = <T extends { id: string }>(
  items: T[],
  currentPage: number = 1,
  itemsPerPage: number = 20
): PaginatedState<T> => {
  const normalized = normalizeArray(items);
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    ...normalized,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};

// Утилиты для работы с кэшем
export interface CacheState<T> {
  data: NormalizedState<T>;
  lastUpdated: number;
  isStale: boolean;
}

export const createCacheState = <T extends { id: string }>(
  items: T[]
): CacheState<T> => {
  return {
    data: normalizeArray(items),
    lastUpdated: Date.now(),
    isStale: false,
  };
};

export const isCacheStale = <T>(
  cache: CacheState<T>,
  staleTime: number = 5 * 60 * 1000
): boolean => {
  return Date.now() - cache.lastUpdated > staleTime;
};

// Утилиты для работы с фильтрацией
export const filterEntities = <T>(
  state: NormalizedState<T>,
  predicate: (entity: T) => boolean
): NormalizedState<T> => {
  const filteredIds = state.allIds.filter(id => predicate(state.byId[id]));
  
  return {
    byId: Object.fromEntries(
      filteredIds.map(id => [id, state.byId[id]])
    ),
    allIds: filteredIds,
  };
};

// Утилиты для работы с сортировкой
export const sortEntities = <T>(
  state: NormalizedState<T>,
  compareFn: (a: T, b: T) => number
): NormalizedState<T> => {
  const sortedIds = state.allIds
    .map(id => ({ id, entity: state.byId[id] }))
    .sort((a, b) => compareFn(a.entity, b.entity))
    .map(item => item.id);

  return {
    ...state,
    allIds: sortedIds,
  };
};
