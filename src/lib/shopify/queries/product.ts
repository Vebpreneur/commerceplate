import productFragment from "../fragments/product";

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
      metafields(identifiers: [
        {namespace:"custom",key:"specifications"},
        {namespace:"custom",key:"spec"},
        {namespace:"custom",key:"technical_specifications"},
        {namespace:"custom",key:"details"},
        {namespace:"custom",key:"detaljer"},
        {namespace:"custom",key:"included"},
        {namespace:"custom",key:"ingar"},
        {namespace:"custom",key:"features"},
        {namespace:"custom",key:"compatibility"},
        {namespace:"custom",key:"kompatibilitet"},
        {namespace:"custom",key:"usage"},
        {namespace:"custom",key:"anvandning"},
        {namespace:"custom",key:"maintenance"},
        {namespace:"custom",key:"underhall"},
        {namespace:"custom",key:"safety"},
        {namespace:"custom",key:"sakerhet"},
        {namespace:"custom",key:"safety_information"},
        {namespace:"custom",key:"sakerhetsinformation"},
        {namespace:"custom",key:"safety_instructions"},
        {namespace:"custom",key:"specifikationer"},
        {namespace:"custom",key:"technical_details"},
        {namespace:"custom",key:"product_details"},
        {namespace:"custom",key:"dimensions"},
        {namespace:"custom",key:"measurements"},
        {namespace:"custom",key:"what_is_included"},
        {namespace:"custom",key:"package_contents"},
        {namespace:"custom",key:"care_instructions"},
        {namespace:"custom",key:"faq"},
        {namespace:"custom",key:"cta_content"},
        {namespace:"custom",key:"feature_overview"},
        {namespace:"custom",key:"product_highlight"},
        {namespace:"custom",key:"ownership_details"},
        {namespace:"custom",key:"product_faq"},
        {namespace:"custom",key:"short_description"},
        {namespace:"custom",key:"what_s_included"},
        {namespace:"custom",key:"app_features"},
        {namespace:"custom",key:"setup_instructions"}
      ]) { namespace key type value }
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $cursor: String
  ) {
    products(
      sortKey: $sortKey
      reverse: $reverse
      query: $query
      first: 24
      after: $cursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

export const getHighestProductPriceQuery = /* GraphQL */ `
  query getHighestProductPrice {
    products(first: 1, sortKey: PRICE, reverse: true) {
      edges {
        node {
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
