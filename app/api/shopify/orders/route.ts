import { shopifyApi } from "@shopify/shopify-api";

// function to get the customer orders
export async function POST(_request: any) {
  const data = await _request.json();
  const { email } = data;
  /// check the availability from the third part api
  try {
    const shop = process.env.SHOPIFY_STORE;
    const accessToken = process.env.SHOPIFY_TOKEN;

    const query = `{
                        customers(first: 1, query: "${email}") {
                            edges {
                            node {
                                id
                                firstName
                                lastName
                                email
                                orders(first: 50) {
                                edges {
                                    node {
                                    id
                                    name
                                    processedAt
                                    totalPriceSet {
                                                        shopMoney{
                                        amount
                                        currencyCode
                                        }
                                    }
                                    lineItems(first: 5) {
                                        edges {
                                        node {
                                            title
                                            quantity
                                        }
                                        }
                                    }
                                    }
                                }
                                }
                            }
                            }
                        }
                        }

                `;

    const response = await fetch(
      `https://${shop}/admin/api/2024-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken!, // Include access token
        },
        body: JSON.stringify({ query }),
      }
    );

    const responseData = await response.json();

    /// prepare the data

    const orders = responseData?.data?.customers?.edges?.map(
      (customer: any) => {
        return {
          id: customer.node.id,
          firstName: customer.node.firstName,
          lastName: customer.node.lastName,
          email: customer.node.email,
          orders: customer.node.orders.edges.map((order: any) => {
            return {
              id: order.node.id,
              name: order.node.name,
              processedAt: order.node.processedAt,
              totalPrice: order.node.totalPriceSet.shopMoney.amount,
              currency: order.node.totalPriceSet.shopMoney.currencyCode,
              lineItems: order.node.lineItems.edges.map((lineItem: any) => {
                return {
                  title: lineItem.node.title,
                  quantity: lineItem.node.quantity,
                };
              }),
            };
          }),
        };
      }
    );

    return new Response(JSON.stringify(orders), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error in find products", error);
    return new Response(JSON.stringify({ error: error }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
