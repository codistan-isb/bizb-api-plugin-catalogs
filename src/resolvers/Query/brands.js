
export default async function brands(parent, args, ctx, info) {

    const { Tags} = ctx.collections;
    const brandNames = await Tags.find({
    }).toArray();
    // Extracting only the storeName field using the map function
    const extractedBrandNames = brandNames
    .map(brand => brand.name)
    .filter(name => name.startsWith("brand-"));


    return extractedBrandNames;

}

