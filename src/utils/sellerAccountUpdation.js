import ReactionError from "@reactioncommerce/reaction-error";
export default async function sellerAccountUpdation(productId, product, collections) {
    try {
        let catalogProduct = await collections.Catalog.findOne({
            "product._id": productId
        });
        let accountDetails = await collections.Accounts.findOne({
            "_id": product?.sellerId
        });
        let updateNeeded = false;
        if (accountDetails && accountDetails?.tagIds) {
            for (let tagId of catalogProduct?.product?.tagIds) {
                // && accountDetails?.tagIds?.indexOf(tagId) === -1
                if (tagId !== "" && accountDetails?.tagIds?.indexOf(tagId) === -1) {
                    accountDetails.tagIds.push(tagId);
                    updateNeeded = true;
                }
            }
        } else {
            for (let tagId of catalogProduct?.product?.tagIds) {
                if (tagId !== "") {
                    accountDetails.tagIds.push(tagId);
                    updateNeeded = true;
                }
            }
        }
        if (updateNeeded) {
            await collections.Accounts.updateOne({ _id: product?.sellerId }, { $set: { tagIds: accountDetails?.tagIds, updatedAt: new Date() } });
        }
    } catch (error) {
        console.log("error", error);
        throw new ReactionError("access-denied", "Access Denied");
    }


}