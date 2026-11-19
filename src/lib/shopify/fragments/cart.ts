import imageFragment from "./image";
const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              image { ...image }
              selectedOptions { name value }
              product { id title handle featuredImage { ...image } }
            }
          }
        }
      }
    }
    totalQuantity
  }
  ${imageFragment}
`;
export default cartFragment;
