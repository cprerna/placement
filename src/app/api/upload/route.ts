import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { stackServerApp } from '@/stack';

export async function POST(request: Request) {
  // Check authentication
  try {
    await stackServerApp.getUser({ or: 'throw' });
  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename, contentType } = await request.json();

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
    console.log('Creating S3 client with:', {
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    });

    const client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      region: process.env.AWS_REGION,
    });

    const fileKey = uuidv4();
    console.log('Creating presigned post for key:', fileKey);

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    console.log('Successfully created presigned post');
    return Response.json({ url, fields, key: fileKey });
  } catch (error) {
    console.error('Error creating presigned post:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json({ error: `S3 Error: ${errorMessage}` }, { status: 500 });
  }
}
