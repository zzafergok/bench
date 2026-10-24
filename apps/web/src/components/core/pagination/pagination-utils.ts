import type { AdvancedPaginationOptions } from './types';

export const getPaginationOffset = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize;
};

export const getPaginatedData = <T>(
  data: T[],
  page: number,
  pageSize: number,
): { items: T[]; total: number; totalPages: number } => {
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = getPaginationOffset(page, pageSize);
  const items = data.slice(offset, offset + pageSize);

  return {
    items,
    total,
    totalPages,
  };
};

export function getAdvancedPaginatedData<T>({
  data,
  page,
  pageSize,
  sortBy,
  sortOrder = 'asc',
  filters = {},
  searchText = '',
  searchFields = [],
}: AdvancedPaginationOptions<T>) {
  let processedData = [...data];

  // Arama filtresini uygula
  if (searchText.trim() && searchFields.length > 0) {
    const searchLower = searchText.toLowerCase();
    processedData = processedData.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return (
          value != null && String(value).toLowerCase().includes(searchLower)
        );
      }),
    );
  }

  // Filtreleri uygula
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          processedData = processedData.filter((item) => {
            const itemRecord = item as Record<string, unknown>;
            return value.includes(itemRecord[key]);
          });
        }
      } else {
        processedData = processedData.filter((item) => {
          const itemRecord = item as Record<string, unknown>;
          const itemValue = itemRecord[key];
          if (itemValue == null) return false;
          return String(itemValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());
        });
      }
    }
  });

  // Sıralamayı uygula
  if (sortBy) {
    processedData = processedData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  // Sayfalamayı uygula
  return getPaginatedData(processedData, page, pageSize);
}
