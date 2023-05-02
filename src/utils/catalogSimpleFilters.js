const CATALOG_PLUGIN_SIMPLE_FILTERS = ["size", "color", "minprice", "maxprice"];

/**
 *
 * @method xformCatalogSimpleFilters
 * @memberof Catalog
 * @summary Transforms a boolean filters array into a mongo filter expression
 * @param {Object} context - an object containing per-request state
 * @param {Object[]} simpleFilters - Array of Boolean filters
 * @returns {Object} Mongo filter expression
 */
export default async function xformCatalogSimpleFilters(context, simpleFilters) {
    const mongoFilters = [];

    // Catalog plugin's filters, if any
    for (const filter of simpleFilters) {
        if (CATALOG_PLUGIN_SIMPLE_FILTERS.includes(filter.name)) {
            let { value } = filter;
            // Ensure that documents where the filter field is
            // not set are also returned.
            if (value === false) value = { $ne: true };

            mongoFilters.push({ [`product.${filter.name}`]: value });
        }
    }

    // Provide the opportunity for other plugins to add simple filters
    for (const func of context.getFunctionsOfType("xformCatalogSimpleFilters")) {
        const additionalMongoFilters = await func(context, simpleFilters); // eslint-disable-line no-await-in-loop
        if (additionalMongoFilters) {
            // Merge all filters
            Array.prototype.push.apply(mongoFilters, additionalMongoFilters);
        }
        // console.log("additional Mongo Filters ", additionalMongoFilters)
    }
    // console.log(additionalMongoFilters)

    if (mongoFilters.length === 0) return {};
    // console.log("mongo Filters ", mongoFilters)
    return {
        $or: mongoFilters
    };
}
