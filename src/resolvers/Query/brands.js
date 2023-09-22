
export default async function brands(parent, args, ctx, info) {

    const { Tags} = ctx.collections;
    const brandNames = await Tags.find({
    }).toArray();
    // console.log("brandNames ", brandNames);
    // Extracting only the storeName field using the map function
    const extractedBrandNames = brandNames
    .map(brand => brand.name)
    .filter(name => name.startsWith("brand-"));

    console.log("extractedBrandNames ", extractedBrandNames);

    return extractedBrandNames;

}

