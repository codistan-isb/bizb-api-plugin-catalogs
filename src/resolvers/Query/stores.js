export default async function stores(parent, args, ctx, info) {
    try {
        const { Accounts } = ctx.collections;
        const storeNames = await Accounts.find({
            roles : "customer"

        }).toArray();
      
        const extractedStoreNames = storeNames.map(store => store.storeName);

        console.log("extractedStoreNames ", extractedStoreNames);

        return extractedStoreNames;

    } catch (error) {
        throw new Error(error);
    }
}
