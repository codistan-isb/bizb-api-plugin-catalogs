import _ from "lodash";
import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @name catalogItems
 * @method
 * @memberof Catalog/NoMeteorQueries
 * @summary query the Catalog by shop ID and/or tag ID
 * @param {Object} context - an object containing the per-request state
 * @param {Object} params - request parameters
 * @param {String[]} [params.searchQuery] - Optional text search query
 * @param {String[]} [params.shopIds] - Shop IDs to include (OR)
 * @param {String[]} [params.tags] - Tag IDs to include (OR)
 * @returns {Promise<MongoCursor>} - A MongoDB cursor for the proper query
 */
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
  // console.log("priceRange: ", priceRange);
  const { collections } = context;
  const { Catalog, Tags } = collections;

  if ((!shopIds || shopIds.length === 0) && (!tagIds || tagIds.length === 0)) {
    throw new ReactionError(
      "invalid-param",
      "You must provide tagIds or shopIds or both"
    );
  }
  // console.log(catalogSimpleFilters);
  // const query = {
  //   "product.isDeleted": { $ne: true },
  //   ...catalogBooleanFilters,
  //   ...catalogSimpleFilters,
  //   "product.isVisible": true,
  //   "product.pricing.USD.minPrice": {
  //     $ne: null,
  //   },
  //   "product.pricing.USD.maxPrice": {
  //     $ne: null,
  //   },
  //   "product.media": {
  //     $elemMatch: {
  //       URLs: { $exists: true, $ne: null, $ne: "", $ne: {} },
  //     },
  //   },
  // };
  const query = {
    "product.isDeleted": { $ne: true },
    ...catalogBooleanFilters,
    ...catalogSimpleFilters,
    "product.isVisible": true,
    "product.pricing.USD.minPrice": {
      $ne: null,
    },
    "product.pricing.USD.maxPrice": {
      $ne: null,
    },
    "product.media": {
      $elemMatch: {
        URLs: { $exists: true, $ne: null, $ne: "", $ne: {} },
      },
    },
    $and: [
      {
        "product.media.URLs.large": {
          $not: { $regex: /public\/bizb-\d+\/\/.*/ },
        },
      },
      {
        "product.media.URLs.medium": {
          $not: { $regex: /public\/bizb-\d+\/\/.*/ },
        },
      },
      {
        "product.media.URLs.small": {
          $not: { $regex: /public\/bizb-\d+\/\/.*/ },
        },
      },
      {
        "product.media.URLs.original": {
          $not: { $regex: /public\/bizb-\d+\/\/.*/ },
        },
      },
    ],
  };

  // cmVhY3Rpb24vY2F0YWxvZ0l0ZW06V3FHazJwQTR6SkNFejdLcFM=
  // console.log("Query: ", query);
  if (shopIds) query.shopId = { $in: shopIds };
  console.log("tags here in catalog", tagIds)
  if (tagIds) {
  const tagDocuments = await Tags.find({ slug: { $in: tagIds } }).toArray();
  const tagIdsSlug = tagDocuments.map(tag => tag._id);
  console.log("tags here in catalog slug", tagIds, tagIdsSlug, tagDocuments)

  query["product.tagIds"] = { $in: tagIdsSlug };
  }

  if (searchQuery) {
    query.$text = {
      $search: _.escapeRegExp(searchQuery),
    };
  }
  if (priceRange) {
    const minPrice = priceRange.find((item) => item.name === "minPrice").value;
    const maxPrice = priceRange.find((item) => item.name === "maxPrice").value;
    // const searchQuery1 = `${minPrice} ${maxPrice}`;

    query[`product.pricing.USD.minPrice`] = { $gte: parseFloat(minPrice) };
    query[`product.pricing.USD.maxPrice`] = { $lte: parseFloat(maxPrice) };
    // query["product.pricing.USD"] = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    // query["pricing"] = { $gte: minPrice };
    // query["pricing"] = { $lte: maxPrice };
    // query.$text = {
    //   $search: _.escapeRegExp(searchQuery1),
    // };
  }
  // console.log("Updated Query ", query);
  // const valueInter = await Catalog.find(query).toArray();
  // console.log("Catalog ", valueInter);

  return Catalog.find(query);
}
