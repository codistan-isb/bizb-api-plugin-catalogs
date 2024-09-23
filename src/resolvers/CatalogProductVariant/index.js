import resolveShopFromShopId from "@reactioncommerce/api-utils/graphql/resolveShopFromShopId.js";
import xformCatalogProductMedia from "../../utils/xformCatalogProductMedia.js";
import {
  encodeCatalogProductVariantOpaqueId,
  encodeProductOpaqueId,
} from "../../xforms/id.js";

export default {
  _id: (node) => encodeCatalogProductVariantOpaqueId(node?._id),
  media: (node, args, context) => {
    if (!node?.media) return null; // Return null if media is not present
    return node?.media.map((mediaItem) =>
      xformCatalogProductMedia(mediaItem, context)
    );
  },
  primaryImage: (node, args, context) => {
    return node?.primaryImage
      ? xformCatalogProductMedia(node?.primaryImage, context)
      : null; // Return null if primaryImage is not present
  },
  shop: resolveShopFromShopId,
  variantId: (node) => encodeProductOpaqueId(node?.variantId),
};
