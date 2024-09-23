/**
 * @summary Converts URLs object in a MediaItem to absolute (if not already)
 * @param {Object} context App context
 * @param {Object} mediaItem Media item
 * @returns {Object} Transformed media item
 */
function ensureAbsoluteUrls(context, mediaItem) {
  if (!mediaItem || !mediaItem.URLs) return mediaItem;

  const URLs = {};
  Object.keys(mediaItem.URLs).forEach((name) => {
    if (mediaItem?.URLs[name]) {
      // Ensure the URL is not null or undefined
      URLs[name] = context.getAbsoluteUrl(mediaItem?.URLs[name]);
    } else {
      // If URL is null or undefined, handle it appropriately (log or skip)
      URLs[name] = null; // Or handle it as per your requirement
    }
  });

  return { ...mediaItem, URLs };
}

/**
 * @name xformCatalogProductMedia
 * @method
 * @memberof GraphQL/Transforms
 * @summary Transforms DB media object to final GraphQL result. Calls functions plugins have registered for type
 *  "xformCatalogProductMedia". First to return an object is returned here
 * @param {Object} mediaItem Media item object. See ImageInfo SimpleSchema
 * @param {Object} context Request context
 * @returns {Object} Transformed media item
 */
export default async function xformCatalogProductMedia(mediaItem, context) {
  // Handle null mediaItem early
  if (!mediaItem) return null;

  const xformCatalogProductMediaFuncs = context.getFunctionsOfType(
    "xformCatalogProductMedia"
  );
  for (const func of xformCatalogProductMediaFuncs) {
    const xformedMediaItem = await func(mediaItem, context); // eslint-disable-line no-await-in-loop
    if (xformedMediaItem) {
      return ensureAbsoluteUrls(context, xformedMediaItem);
    }
  }

  return ensureAbsoluteUrls(context, mediaItem);
}
