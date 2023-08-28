import { CommonHeaders } from 'test/types';
import { usersRoutes } from '../endpoints';
import _request from '../lib/request';

const removeTokenUser = async (
  request: typeof _request,
  userId: string,
  commonHeaders: Partial<CommonHeaders>,
) => {
  // delete user
  await request.delete(usersRoutes.delete(userId)).set(commonHeaders);
};

export default removeTokenUser;
