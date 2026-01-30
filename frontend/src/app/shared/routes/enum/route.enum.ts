import { AppNode } from './node.enum';

export enum AppRoutes {
  ROOT = '/',
  PUBLIC = `/${AppNode.PUBLIC}`,
  AUTHENTICATED = `/${AppNode.AUTHENTICATED}`,
  MEMBER = `${AppRoutes.AUTHENTICATED}/${AppNode.MEMBER}`,
  MEMBER_DETAIL = `${AppRoutes.MEMBER}/detail/`,
  SIGN_IN = `/${AppNode.PUBLIC}/${AppNode.SIGN_IN}`,
  SIGN_UP = `/${AppNode.PUBLIC}/${AppNode.SIGN_UP}`,
  NOUVELLE_COMMANDE = `${AppRoutes.AUTHENTICATED}/${AppNode.COMMANDES}/${AppNode.NOUVELLE_COMMANDE}`,
  COMMANDES_EN_COURS = `${AppRoutes.AUTHENTICATED}/${AppNode.COMMANDES}/${AppNode.COMMANDES_EN_COURS}`,
}

