import ReactionError from "@reactioncommerce/reaction-error";
export default async function sellerAccountUpdation(productId, product, collections) {
    try {
        // console.log("sellerAccountUpdation inside");
        let catalogProduct = await collections.Catalog.findOne({
            "product._id": productId
        });
        // console.log("catalogProduct :- ", catalogProduct);
        // console.log("catalogProduct?.product?.tagIds :- ", catalogProduct?.product?.tagIds);
        // console.log("Product seller ID :- ", product?.sellerId);
        let accountDetails = await await collections.Accounts.findOne({
            "_id": product?.sellerId
        });
        let updateNeeded = false;
        if (accountDetails && accountDetails?.tagIds) {
            for (let tagId of catalogProduct?.product?.tagIds) {
                console.log("tags id", tagId);
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
        console.log("seller with tagIds", tagIds);
        // console.log("updateNeeded", updateNeeded);
        console.log("update Account Details seller with tagIds", accountDetails);
        if (updateNeeded) {
            await collections.Accounts.updateOne({ _id: product?.sellerId }, { $set: { tagIds: accountDetails?.tagIds, updatedAt: new Date() } });
            // const result =  console.log(`Updated ${result.modifiedCount} document(s)`);
        }
    } catch (error) {
        console.log("error", error);
        throw new ReactionError("access-denied", "Access Denied");
    }


}