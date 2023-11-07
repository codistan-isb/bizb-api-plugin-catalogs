export default async function sameDayDelivery(node, args, context) {
    const { collections, authToken } = context;
    const { Accounts } = collections;
    // console.log("context  here sameDayDelivery node only", node);
    // console.log("context  here sameDayDelivery node seller", node?.variants[0]?.uploadedBy?.userId);
    // console.log("context  here sameDayDelivery node uploaded by id", node?.product?.variants);
    let sellerId = node?.variants[0]?.uploadedBy?.userId
    if (authToken) {
        // console.log("user same Day Delivery ", context?.account);
        let userCity = context?.account?.city
        let sellerCityDoc = await Accounts.findOne({ "_id": sellerId }, { city: 1 });
        // console.log("sellerCityDoc", sellerCityDoc);
        let sellerCity = sellerCityDoc?.city;
        // console.log("sellerCity", sellerCity);
        if (sellerCity === userCity) {
            return true;
        } else {
            return false;
        }
    } else {
        return null;
    }

}