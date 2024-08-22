export default async function sameDayDelivery(node, args, context) {
    const { collections, authToken } = context;
    const { Accounts } = collections;
    let sellerId = node?.variants[0]?.uploadedBy?.userId
    if (authToken) {
        let userCity = context?.account?.city
        let sellerCityDoc = await Accounts.findOne({ "_id": sellerId }, { city: 1 });
        let sellerCity = sellerCityDoc?.city;
        if (sellerCity === userCity) {
            return true;
        } else {
            return false;
        }
    } else {
        return null;
    }

}