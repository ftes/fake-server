function parseNumbers(obj) {
  const result = {};
  // convert to numbers
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const value = obj[key];
    const parsedValue = value * 1;
    result[key] = Number.isNaN(parsedValue)
      ? parsedValue
      : value;
  });
  return result;
}

export default function middleware(req, res, next) {
  // eslint-disable-next-line no-underscore-dangle
  res.body._params = parseNumbers(req.query);
  next();
}
