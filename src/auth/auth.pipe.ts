import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RefreshTokenDto } from './dto/refresh.dto';
import { AbsentRefreshTokenError } from './errors';

@Injectable()
export class ParseRefreshTokenPipe
  implements PipeTransform<RefreshTokenDto, RefreshTokenDto>
{
  transform(
    value: RefreshTokenDto,
    metadata: ArgumentMetadata,
  ): RefreshTokenDto {
    if (metadata.type === 'body') {
      if (
        !value ||
        !value.refreshToken ||
        typeof value.refreshToken !== 'string' ||
        value.refreshToken.length === 0
      ) {
        throw new AbsentRefreshTokenError();
      }
    }
    return value;
  }
}
