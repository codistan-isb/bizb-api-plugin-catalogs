const CATALOG_PLUGIN_SIMPLE_FILTERS = ["size", "color", "minPrice", "maxPrice"];
/**
 *
 * @method xformCatalogSimpleFilters
 * @memberof Catalog
 * @summary Transforms a boolean filters array into a mongo filter expression
 * @param {Object} context - an object containing per-request state
 * @param {Object[]} simpleFilters - Array of Boolean filters
 * @returns {Object} Mongo filter expression
 */

export default async function xformCatalogSimpleFilters(
  context,
  simpleFilters
) {
  const mongoFilters = [];
  // Catalog plugin's filters, if any
  for (const filter of simpleFilters) {
    if (CATALOG_PLUGIN_SIMPLE_FILTERS.includes(filter.name)) {
      const { name, value } = filter;
      // Dynamically create the regex pattern for the size or color
      const filterPath = `product.variants.optionTitle`;
      const regexPattern = new RegExp(
        `"${name}":"\\\\\\"${value}\\\\\\""`,
        "i"
      );
      console.log("FILTER PATH", filterPath);
      console.log("REGEX PATTERN", regexPattern);
      mongoFilters.push({ [filterPath]: { $regex: regexPattern } });
    }
  }
  // Provide the opportunity for other plugins to add simple filters
  for (const func of context.getFunctionsOfType("xformCatalogSimpleFilters")) {
    const additionalMongoFilters = await func(context, simpleFilters); // eslint-disable-line no-await-in-loop
    if (additionalMongoFilters) {
      // Merge all filters
      Array.prototype.push.apply(mongoFilters, additionalMongoFilters);
    }
  }
  if (mongoFilters.length === 0) return {};
  return {
    $or: mongoFilters,
  };
}