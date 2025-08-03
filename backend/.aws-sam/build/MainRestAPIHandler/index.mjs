import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const ddb_client = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "ap-southeast-2" })
);

const ses_client = new SESClient({ region: "ap-southeast-2" });
const main_table = process.env.MainTableName;
const followers_table = process.env.FollowersTableName;

export async function handler(event) {
  console.log("Event: ", event);
  const { httpMethod, pathParameters } = event;

  if (httpMethod === "GET") {
    if (pathParameters?.id) {
      const data = await getArtistByID(pathParameters.id);

      if (data) {
        return withCorsHeaders({
          statusCode: 200,
          body: JSON.stringify(data),
        });
      }

      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Artist not found" }),
      };
    } else {
      const artists = await getArtists();
      return withCorsHeaders({
        statusCode: 200,
        body: JSON.stringify(artists),
      });
    }
  }

  // We only hande the POST of a new song
  if (httpMethod === "POST") {
    const { body } = event;
    const song = JSON.parse(body);
    const artist_id = event.requestContext.authorizer.claims["sub"];
    const new_song = await createSong(song, artist_id);

    // Handle the sending of emails to followers
    const follower_ids = await getFollowerIds(artist_id);

    for (const follower_id of follower_ids) {
      const email = await getArtistEmail(follower_id);

      console.log(`Sending email to ${email} with song ${new_song.name}`);
      await sendEmail(email, new_song);
    }

    return withCorsHeaders({
      statusCode: 201,
      body: JSON.stringify(new_song),
    });
  }

  return {
    statusCode: 404,
  };
}

async function getArtistEmail(artist_id) {
  const result = await ddb_client.send(
    new QueryCommand({
      TableName: main_table,
      KeyConditionExpression:
        "#partition = :partition AND #artist_id = :artist_id",
      ExpressionAttributeNames: {
        "#partition": "partition",
        "#artist_id": "id",
      },
      ExpressionAttributeValues: {
        ":partition": "artist",
        ":artist_id": artist_id,
      },
      ProjectionExpression: "email",
    })
  );

  return result.Items[0].email;
}
async function getArtistByID(id) {
  const result = await ddb_client.send(
    new QueryCommand({
      TableName: main_table,
      IndexName: "ByArtist",
      KeyConditionExpression: "#artist_id = :artist_id",
      ExpressionAttributeNames: {
        "#artist_id": "artist_id",
      },
      ExpressionAttributeValues: {
        ":artist_id": id,
      },
    })
  );

  const artist = result.Items.find(item => item.partition === "artist");
  const songs = result.Items.filter(item => item.partition === "song");

  return {
    artist,
    songs,
  };
}

async function getArtists() {
  const result = await ddb_client.send(
    new QueryCommand({
      TableName: main_table,
      KeyConditionExpression: "#partition = :partition",
      ExpressionAttributeValues: {
        ":partition": "artist",
      },
      ExpressionAttributeNames: {
        "#partition": "partition",
      },
    })
  );

  return result.Items;
}

async function getFollowerIds(artist_id) {
  const result = await ddb_client.send(
    new QueryCommand({
      TableName: followers_table,
      KeyConditionExpression: "#partition = :partition",
      ExpressionAttributeValues: {
        ":partition": `${artist_id}#followed_by`,
      },
      ExpressionAttributeNames: {
        "#partition": "partition",
      },
      ProjectionExpression: "follower_id",
    })
  );

  return result.Items.map(item => item.follower_id);
}

async function createSong(song, artist_id) {
  const Item = {
    partition: "song",
    id: generateId(),
    name: song.name,
    artist_id: artist_id,
    song_file_key: song.song_file_key,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await ddb_client.send(
    new PutCommand({
      TableName: main_table,
      Item,
    })
  );

  return Item;
}

function generateId() {
  return crypto.randomUUID();
}

export function withCorsHeaders(data) {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    },
    ...data,
  };
}

async function sendEmail(email, new_song) {
  console.log(`Sending email to ${email} with song ${new_song.name}`);

  await ses_client.send(
    new SendEmailCommand({
      Source: "bromleyben7@gmail.com",
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "New song uploaded",
        },
        Body: {
          Text: {
            Data: `A new song has been uploaded: ${new_song.name}`,
          },
        },
      },
    })
  );
}
