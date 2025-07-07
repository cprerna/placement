import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

interface FileKeys {
  photo_key?: string | null;
  application_form_key?: string | null;
  attendance_key?: string | null;
  placement_doc_key?: string | null;
  placement_proof_key?: string | null;
  training_proof_key?: string | null;
}

/**
 * Deletes multiple files from S3 bucket
 * Used when deleting a student record to clean up associated files
 */
export async function deleteStudentFiles(fileKeys: FileKeys): Promise<void> {
  if (!process.env.AWS_BUCKET_NAME) {
    throw new Error('AWS_BUCKET_NAME environment variable is not set');
  }

  const keys = Object.values(fileKeys).filter(Boolean) as string[];

  if (keys.length === 0) {
    return; // No files to delete
  }

  const deletePromises = keys.map(async (key) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      });

      await s3Client.send(command);
      console.log(`Successfully deleted file with key: ${key}`);
    } catch (error) {
      console.error(`Failed to delete file with key: ${key}`, error);
      // Don't throw error for individual file deletions to avoid blocking the operation
    }
  });

  await Promise.allSettled(deletePromises);
}

/**
 * Deletes a single file from S3 bucket
 */
export async function deleteFile(key: string): Promise<void> {
  if (!process.env.AWS_BUCKET_NAME) {
    throw new Error('AWS_BUCKET_NAME environment variable is not set');
  }

  if (!key) {
    throw new Error('File key is required');
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Gets a signed URL for viewing a file from S3
 */
export async function getSignedUrl(key: string): Promise<string> {
  const response = await fetch('/api/upload/signed-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get signed URL');
  }

  const { signedUrl } = await response.json();
  return signedUrl;
}

/**
 * Downloads a file from S3 using a signed URL
 */
export async function downloadFile(key: string, filename?: string): Promise<void> {
  try {
    const signedUrl = await getSignedUrl(key);

    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = signedUrl;
    link.download = filename || key;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}
