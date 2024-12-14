export let assistantId: string = "";

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID!;
}
