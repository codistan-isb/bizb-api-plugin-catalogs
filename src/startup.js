import Logger from "@reactioncommerce/logger";
import hashProduct from "./mutations/hashProduct.js";
import sellerAccountUpdation from './utils/sellerAccountUpdation.js'
/**
 * @summary Called on startup
 * @param {Object} context Startup context
 * @param {Object} context.collections Map of MongoDB collections
 * @returns {undefined}
 */
export default async function catalogStartup(context) {
  const { appEvents, collections } = context;

  appEvents.on("afterMediaInsert", ({ mediaRecord }) => {
    const { productId } = mediaRecord.metadata || {};
    if (productId) {
      hashProduct(productId, collections, false).catch((error) => {
        Logger.error(`Error updating currentProductHash for product with ID ${productId}`, error);
      });
    }
  });

  appEvents.on("afterMediaUpdate", ({ mediaRecord }) => {
    const { productId } = mediaRecord.metadata || {};
    if (productId) {
      hashProduct(productId, collections, false).catch((error) => {
        Logger.error(`Error updating currentProductHash for product with ID ${productId}`, error);
      });
    }
  });

  appEvents.on("afterMediaRemove", ({ mediaRecord }) => {
    const { productId } = mediaRecord.metadata || {};
    if (productId) {
      hashProduct(productId, collections, false).catch((error) => {
        Logger.error(`Error updating currentProductHash for product with ID ${productId}`, error);
      });
    }
  });

  appEvents.on("afterProductSoftDelete", ({ product }) => {
    collections.Catalog.updateOne({
      "product.productId": product._id
    }, {
      $set: {
        "product.isDeleted": true
      }
    });
  });

  const productOrVariantUpdateHandler = ({ productId }) => {
    if (productId) {
      hashProduct(productId, collections, false).catch((error) => {
        Logger.error(`Error updating currentProductHash for product with ID ${productId}`, error);
      });
    }
  };
  const sellerAccountUpdateHandler = async ({ productId, product }) => {
    if (productId) {
      sellerAccountUpdation(productId, product, collections)
    }
  };
  appEvents.on("viewInsights", async (  {context,payload} ) => {
    const { collections } = context;
    const { Catalog } = collections;
    
    const { productId } = payload;
  
    const product = await Catalog.findOne(payload);
    
    if (product) {
      // Increment view count
      const updatedViewCount = (product.viewCount || 0) + 1;
  
      // Update the product document with the incremented view count
    const updateProduct  =   await Catalog.updateOne(
        { _id: product._id }, // Using _id to uniquely identify the product
        { $inc: { "product.viewCount": updatedViewCount } }
      );
    }
  
  });
  

  appEvents.on("afterProductUpdate", productOrVariantUpdateHandler);
  appEvents.on("afterProductUpdate", sellerAccountUpdateHandler);
  appEvents.on("afterVariantUpdate", productOrVariantUpdateHandler);
}
