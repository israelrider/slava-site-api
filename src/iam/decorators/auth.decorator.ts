import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { AuthType } from '@/iam/enums/auth-type.enum';

export const AUTH_TYPE_KEY = 'authType';
export const Auth: (...authThpe: AuthType[]) => CustomDecorator<string> = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
