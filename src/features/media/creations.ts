import { Directory, File, Paths } from 'expo-file-system';

/** Photos saved from Veloura are also kept here, for the in-app Gallery. */
function creationsDir() {
  const dir = new Directory(Paths.document, 'creations');
  if (!dir.exists) dir.create();
  return dir;
}

export async function saveCreation(sourceUri: string) {
  const dest = new File(creationsDir(), `glow-${Date.now()}.jpg`);
  await new File(sourceUri).copy(dest);
  return dest.uri;
}

/** Newest first. */
export function listCreations(): string[] {
  return creationsDir()
    .list()
    .filter((entry): entry is File => entry instanceof File && entry.name.endsWith('.jpg'))
    .sort((a, b) => b.name.localeCompare(a.name))
    .map((file) => file.uri);
}

export function deleteCreation(uri: string) {
  const file = new File(uri);
  if (file.exists) file.delete();
}
