import { File, Paths } from 'expo-file-system';

/** Tiny synchronous JSON store in the app's document directory. */
export function readJSON<T>(name: string, fallback: T): T {
  try {
    const file = new File(Paths.document, name);
    return file.exists ? (JSON.parse(file.textSync()) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(name: string, value: unknown) {
  const file = new File(Paths.document, name);
  if (!file.exists) file.create();
  file.write(JSON.stringify(value));
}
