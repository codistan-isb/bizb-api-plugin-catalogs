import _ from "lodash";
import ReactionError from "@reactioncommerce/reaction-error";

// /**
//  * @name catalogItems
//  * @method
//  * @memberof Catalog/NoMeteorQueries
//  * @summary query the Catalog by shop ID and/or tag ID
//  * @param {Object} context - an object containing the per-request state
//  * @param {Object} params - request parameters
//  * @param {String[]} [params.searchQuery] - Optional text search query
//  * @param {String[]} [params.shopIds] - Shop IDs to include (OR)
//  * @param {String[]} [params.tags] - Tag IDs to include (OR)
//  * @returns {Promise<MongoCursor>} - A MongoDB cursor for the proper query
//  */
// export default async function catalogItems(
//   context,
//   {
//     searchQuery,
//     priceRange,
//     shopIds,
//     tagIds,
//     catalogBooleanFilters,
//     catalogSimpleFilters,
//   } = {}
// ) {
//   const { collections } = context;
//   const { Catalog, Tags } = collections;

//   if ((!shopIds || shopIds.length === 0) && (!tagIds || tagIds.length === 0)) {
//     throw new ReactionError(
//       "invalid-param",
//       "You must provide tagIds or shopIds or both"
//     );
//   }

//   const query = {
//     "product.isDeleted": { $ne: true },
//     "product.isSoldOut": { $ne: true },
//     ...catalogBooleanFilters,
//     ...catalogSimpleFilters,
//     "product.isVisible": true,
//     "product.pricing.USD.minPrice": {
//       $ne: null,
//     },
//     "product.pricing.USD.maxPrice": {
//       $ne: null,
//     },
//     "product.media": {
//       $elemMatch: {
//         URLs: { $exists: true, $ne: null, $ne: "", $ne: {} },
//       },
//     },
//     $and: [
//       {
//         "product.media.URLs.large": {
//           $not: { $regex: /public\/bizb-\d+\/\/.*/ },
//         },
//       },
//       {
//         "product.media.URLs.medium": {
//           $not: { $regex: /public\/bizb-\d+\/\/.*/ },
//         },
//       },
//       {
//         "product.media.URLs.small": {
//           $not: { $regex: /public\/bizb-\d+\/\/.*/ },
//         },
//       },
//       {
//         "product.media.URLs.original": {
//           $not: { $regex: /public\/bizb-\d+\/\/.*/ },
//         },
//       },
//     ],
//   };

//   if (shopIds) query.shopId = { $in: shopIds };
//   console.log("tags here in catalog", tagIds);
//   if (tagIds) {


//     query["product.tagIds"] = { $in: tagIds };
//   }

//   if (searchQuery) {
//     query.$text = {
//       $search: _.escapeRegExp(searchQuery),
//     };
//   }
//   if (priceRange) {
//     const minPrice = priceRange.find((item) => item.name === "minPrice").value;
//     const maxPrice = priceRange.find((item) => item.name === "maxPrice").value;

//     query[`product.pricing.USD.minPrice`] = { $gte: parseFloat(minPrice) };
//     query[`product.pricing.USD.maxPrice`] = { $lte: parseFloat(maxPrice) };

//   }


//   return Catalog.find(query);
// }




export default async function catalogItems(
  context,
  {
    searchQuery,
    priceRange,
    shopIds,
    tagIds,
    catalogBooleanFilters,
    catalogSimpleFilters,
  } = {}
) {
  const { collections } = context;
  const { Catalog, SimpleInventory } = collections;

  if ((!shopIds || shopIds.length === 0) && (!tagIds || tagIds.length === 0)) {
    throw new ReactionError(
      "invalid-param",
      "You must provide tagIds or shopIds or both"
    );
  }

  // Fetching inventory items with stock greater than zero
  // const inventoryIdsWithStock = await SimpleInventory.find({inventoryInStock: { $gt: 0 }  }, {    projection: { "productConfiguration.productId": 1 }  }).toArray();


  // const productIds = inventoryIdsWithStock.map(item => item.productConfiguration.productId);




  // Building the query for the Catalog
  const query = {
    // "product._id": { $in: productIds },
    "product.isDeleted": { $ne: true },
    "product.isSoldOut": { $ne: true },
    ...catalogBooleanFilters,
    ...catalogSimpleFilters,
    "product.isVisible": true,
    "product.pricing.USD.minPrice": { $ne: null },
    "product.pricing.USD.maxPrice": { $ne: null }
  };

  if (shopIds) {
    query.shopId = { $in: shopIds };
  }
  if (tagIds) {
    query["product.tagIds"] = { $in: tagIds };
  }
  if (searchQuery) {
    query.$text = {
      $search: _.escapeRegExp(searchQuery),
    };
  }
  if (priceRange) {
    const minPrice = priceRange.find((item) => item.name === "minPrice").value;
    const maxPrice = priceRange.find((item) => item.name === "maxPrice").value;

    query[`product.pricing.USD.minPrice`] = { $gte: parseFloat(minPrice) };
    query[`product.pricing.USD.maxPrice`] = { $lte: parseFloat(maxPrice) };
  }

  return Catalog.find(query)
}

