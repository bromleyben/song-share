import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ddb_client = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "ap-southeast-2" })
);
const main_table = process.env.MainTableName;

export async function handler(event) {
  console.log("Event: ", event);
  // Get the user from the event
  const user = event.request.userAttributes;
  console.log("User: ", user);

  await ddb_client.send(
    new PutCommand({
      TableName: main_table,
      Item: {
        partition: "artist",
        id: user.sub,
        email: user.email,
        artist_id: user.sub,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  );

  return event;
}
