export async function handler() {
  console.log("Message queued!");

  let num: number = Math.floor(Math.random() * (9));

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful", message: num }),
  };
}