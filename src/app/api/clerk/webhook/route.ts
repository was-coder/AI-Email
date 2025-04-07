import { db } from "~/server/db";

// Define the expected structure of the webhook payload
type ClerkWebhookData = {
  id: string;
  email_addresses: { email_address: string }[];
  first_name: string;
  last_name: string;
  image_url: string;
};

export const POST = async (req: Request) => {
  const body = (await req.json()) as { data: ClerkWebhookData };
  const { data } = body;

//   console.log("Clerk webhook received", data);

  const emailAddress = data.email_addresses?.[0]?.email_address;
  if (!emailAddress) {
    return new Response("Missing email address", { status: 400 });
  }
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.image_url;
  const id = data.id;

  await db.user.create({
    data: {
      id,
      emailAddress,
      firstName,
      lastName,
      imageUrl,
    },
  });

  console.log("User Created");

  return new Response("Webhook received", { status: 200 });
};
