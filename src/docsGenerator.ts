import { OpenAPIObject } from '@nestjs/swagger';
import { stringify } from 'yaml';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function generateApiDocs(document: OpenAPIObject): Promise<void> {
  const path = join('doc', 'api.yaml');
  await writeFile(path, stringify(document));
}
