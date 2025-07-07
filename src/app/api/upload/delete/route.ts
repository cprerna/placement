import { stackServerApp } from '@/stack';
import { deleteFile } from '@/lib/s3-utils';

export async function DELETE(request: Request) {
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

  try {
    await deleteFile(key);
    return Response.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
