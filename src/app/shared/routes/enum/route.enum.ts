import { AppNode } from './node.enum';

export enum AppRoutes {
  ROOT = '/',
  PUBLIC = `/${AppNode.PUBLIC}`,
  AUTHENTICATED = `/${AppNode.AUTHENTICATED}`,
  MEMBER = `${AppRoutes.AUTHENTICATED}/${AppNode.MEMBER}`,
  MEMBER_DETAIL = `${AppRoutes.MEMBER}/detail/`,
  SIGN_IN = `/${AppNode.PUBLIC}/${AppNode.SIGN_IN}`,
  SIGN_UP = `/${AppNode.PUBLIC}/${AppNode.SIGN_UP}`,
}

