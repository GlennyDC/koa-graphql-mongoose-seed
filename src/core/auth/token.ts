import config from 'config';
import { sign, verify } from 'jsonwebtoken';

import { TokenPayload } from '../types';

const AUTH_TOKEN_ISSUER = config.get<string>('auth.tokenIssuer');
const AUTH_TOKEN_AUDIENCE = config.get<string>('auth.tokenAudience');
const AUTH_TOKEN_SECRET = config.get<string>('auth.tokenSecret');
const AUTH_TOKEN_SUBJECT = config.get<string>('auth.tokenSubject');
const AUTH_TOKEN_EXPIRATION_INTERVAL = config.get<string>(
  'auth.tokenExpirationInterval',
);

/**
 * Verify a JWT.
 *
 * @private
 *
 * @param {string} token - The JWT to be verified
 *
 * @returns {Promise<object>} A promise to the decoded JWT
 */
const verifyToken = (token: string): Promise<TokenPayload> => {
  const secret = AUTH_TOKEN_SECRET;
  const options = {
    issuer: AUTH_TOKEN_ISSUER,
    audience: AUTH_TOKEN_AUDIENCE,
    subject: AUTH_TOKEN_SUBJECT,
  };
  return new Promise((resolve, reject) => {
    verify(token, secret, options, (err, decodedToken) => {
      if (err) return reject(err);
      return resolve((decodedToken as unknown) as TokenPayload);
    });
  });
};

/**
 * Sign a JWT.
 *
 * @private
 *
 * @param {TokenPayload} payload - The payload to be included in the JWT
 *
 * @returns {Promise<string>} A promise to the JWT
 */
const signToken = (payload: TokenPayload): Promise<string> => {
  const secret = AUTH_TOKEN_SECRET;
  const options = {
    issuer: AUTH_TOKEN_ISSUER,
    audience: AUTH_TOKEN_AUDIENCE,
    expiresIn: AUTH_TOKEN_EXPIRATION_INTERVAL,
    subject: AUTH_TOKEN_SUBJECT,
  };
  return new Promise((resolve, reject) => {
    sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
};

/**
 * Make a JWT.
 *
 * @param {TokenPayload} payload - The payload to be included in the JWT
 *
 * @returns {Promise<string>} A promise to the JWT
 */
const makeToken = async (payload: TokenPayload): Promise<string> => {
  return signToken(payload);
};

/**
 * Extract a JWT.
 *
 * If the JWT is successfully verified, return the decoded payload.
 *
 * @param {string} token - The JWT to be verified and decoded
 *
 * @returns {TokenPayload} The decoded payload of the JWT
 */
const extractToken = async (token: string): Promise<TokenPayload> => {
  return verifyToken(token);
};

export { makeToken, extractToken };
