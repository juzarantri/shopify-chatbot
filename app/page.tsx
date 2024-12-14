"use client";
import Chat from "./components/Chat";
import styles from "./page.module.css";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/index.mjs";

export default function Home() {
  const functionCallHandler = async (
    call: RequiredActionFunctionToolCall
  ): Promise<any> => {
    try {
      const functionName = call?.function?.name;
      const args = JSON.parse(call.function.arguments);

      /// shopify example
      if (functionName === "find_product") {
        /// get the product name and return the product details
        const response = await fetch("/api/shopify/products", {
          body: JSON.stringify({
            product_name: args.query,
          }),
          method: "POST",
        });

        if (response.ok) {
          return JSON.stringify({ success: true, data: await response.json() });
        }
      } else if (functionName === "get_customer_orders") {
        /// get the customer orders and return the orders
        const response = await fetch("/api/shopify/orders", {
          body: JSON.stringify({
            email: args.email,
          }),
          method: "POST",
        });

        if (response.ok) {
          return JSON.stringify({ success: true, data: await response.json() });
        }
      } else if (functionName === "get_products") {
        /// get product recommendation / suggestion
        const response = await fetch("/api/shopify/products", {
          method: "GET",
        });

        if (response.ok) {
          return JSON.stringify({ success: true, data: await response.json() });
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Chat functionCallHandler={functionCallHandler} />
      </div>
    </main>
  );
}
