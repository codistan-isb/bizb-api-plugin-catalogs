import { encodeProductOpaqueId } from "../../xforms/id.js";

export default {
    _id: (node) => {
        return encodeProductOpaqueId(node._id)
    },
    //   variantId: (node) => encodeProductOpaqueId(node.variantId)
};
