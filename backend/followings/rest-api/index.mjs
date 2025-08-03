import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const TableName = process.env.FollowersTableName;

const ddb_client = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "ap-southeast-2" })
);

export async function handler(event) {
  const { artist_id } = event.pathParameters;

  const follower_id = event.requestContext.authorizer.claims["sub"];

  // Add the follower to the artist's following list
  await ddb_client.send(
    new PutCommand({
      TableName,
      Item: {
        id: crypto.randomUUID(),
        partition: `${artist_id}#following`, // The artist being followed
        following_id: follower_id,
        created_at: new Date().toISOString(),
      },
    })
  );

  // Add the artist to the follower's followed_by list
  await ddb_client.send(
    new PutCommand({
      TableName,
      Item: {
        id: crypto.randomUUID(),
        partition: `${artist_id}#followed_by`, // The artist being followed
        follower_id: follower_id,
        created_at: new Date().toISOString(),
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
}
