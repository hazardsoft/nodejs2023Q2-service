import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_META = 'skip_auth';

export const SkipAuth = () => SetMetadata(SKIP_AUTH_META, true);
