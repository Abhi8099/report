module.exports = {
    // Configure one or more authentication providers
    providers: [
        {
            id: 'google',
            type: 'oauth',
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            callbackUrl: '/api/auth/callback/google',
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/webmasters.readonly','https://www.googleapis.com/auth/webmasters'],
        },
    ],
};