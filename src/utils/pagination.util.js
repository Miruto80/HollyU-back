const parsePositiveInteger = (value, name, defaultValue) => {
  if (value === undefined) return defaultValue;

  const parsed = Number(value);
  const isIntegerInput = typeof value === 'number'
    ? Number.isSafeInteger(value)
    : typeof value === 'string' && /^\d+$/.test(value);

  if (!isIntegerInput || !Number.isSafeInteger(parsed) || parsed < 1) {
    const error = new Error(`${name} debe ser un entero positivo`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
};

export const parsePagination = (query, { defaultLimit = 50, maxLimit = 100 } = {}) => {
  const page = parsePositiveInteger(query.page, 'page', 1);
  const requestedLimit = parsePositiveInteger(query.limit, 'limit', defaultLimit);
  const limit = Math.min(requestedLimit, maxLimit);
  const offset = (page - 1) * limit;

  if (!Number.isSafeInteger(offset)) {
    const error = new Error('page está fuera del rango permitido');
    error.statusCode = 400;
    throw error;
  }

  return { limit, offset };
};

export const parseBoundedLimit = (value, { defaultLimit, maxLimit }) => {
  return Math.min(parsePositiveInteger(value, 'limit', defaultLimit), maxLimit);
};
