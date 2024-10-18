// lib/google-auth.js
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Load OAuth2 credentials from the downloaded credentials JSON
const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export default oauth2Client;
