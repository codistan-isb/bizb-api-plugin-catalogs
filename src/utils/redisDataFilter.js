// catalogFilters.js

export const filterBySearchQuery = (nodes, searchQuery) => {
    return nodes.filter(node =>
        node.product && typeof node.product.title === 'string' && node.product.title.includes(searchQuery)
    );
};

export const filterByPriceRange = (nodes, priceRange) => {
    const { minPrice, maxPrice } = priceRange.reduce((acc, item) => {
        acc[item.name] = parseFloat(item.value);
        return acc;
    }, {});

    return nodes.filter(node =>
        node.product &&
        node.product.pricing &&
        node.product.pricing.USD &&
        node.product.pricing.USD.minPrice >= minPrice &&
        node.product.pricing.USD.maxPrice <= maxPrice
    );
};

export const filterBySimpleFilters = (nodes, simpleFilters) => {
    simpleFilters.forEach(filter => {
        const regexPattern = new RegExp(`"${filter.name}":"\\\\"${filter.value}\\\\""`, "i");
        nodes = nodes.filter(node =>
            node.product &&
            node.product.variants &&
            node.product.variants.some(variant =>
                regexPattern.test(variant.optionTitle)
            )
        );
    });

    return nodes;
};

export const filterByTagIds = (nodes, tagIds) => {
    if (!Array.isArray(tagIds) || tagIds.length === 0) {
        // If no tagIds are provided, return the nodes unfiltered
        return nodes;
    }

    return nodes.filter(node =>
        node.product &&
        Array.isArray(node.product.tagIds) && // Ensure this is an array
        tagIds.some(tag => node.product.tagIds.includes(tag))
    );
};

export const applyPagination = (nodes, first, offset) => {
    return nodes.slice(offset, offset + first);
};
