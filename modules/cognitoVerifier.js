import { CognitoJwtVerifier } from "aws-jwt-verify";

// Verify ACCESS tokens
export const accessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: "ap-southeast-2_ECFGGKxov",
  tokenUse: "access",
  clientId: '1oq1itjolj43u1o4ipfg5s22f0',
});
