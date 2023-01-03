

const cap = 30 * 1000
const base = 100
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min
const fullJitter = (retryCount: number) => {
  const temp = Math.min(cap, Math.pow(base * 2, retryCount))
  return temp / 2 + randomBetween(0, temp / 2)
}

export async function main(event: any, context: any) {

  // let messageNumber = parseInt(event["Records"][0]['body'])
  // console.log({ body: messageNumber });
  // if (messageNumber > 7) {
  //   context.
  // }



  // return {};
  let sqsRecords = event.Records;
  let batchItemFailures = [];

  if (sqsRecords.length > 0) {
    for await (const message of sqsRecords) {
      if (parseInt(message.body) > 7)
        batchItemFailures.push({ itemIdentifier: message.messageId })

      // Sqs send a message with Delay (Jitter calculated)

      else {
        console.log("Messaged Succesfully processed!")
      }
    }
  }
  return { batchItemFailures };
}