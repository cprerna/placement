import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { stackServerApp } from '@/stack';

export async function POST(request: Request) {
  // Check authentication
  try {
    await stackServerApp.getUser({ or: 'throw' });
  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { key } = await request.json();

  if (!key) {
    return Response.json({ error: 'Missing file key' }, { status: 400 });
  }

  if (!process.env.AWS_BUCKET_NAME) {
    return Response.json({ error: 'Missing AWS_BUCKET_NAME environment variable' }, { status: 500 });
  }

  if (!process.env.AWS_REGION) {
    return Response.json({ error: 'Missing AWS_REGION environment variable' }, { status: 500 });
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return Response.json({ error: 'Missing AWS credentials' }, { status: 500 });
  }

  try {
    const client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      region: process.env.AWS_REGION,
    });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    // Generate signed URL that expires in 1 hour
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return Response.json({ signedUrl });
  } catch (error) {
    console.error('Error creating signed URL:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json({ error: `S3 Error: ${errorMessage}` }, { status: 500 });
  }
}
