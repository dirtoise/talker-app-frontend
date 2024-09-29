import {createAuthProvider} from 'react-token-auth';

export const {useAuth, authFetch, login, logout} =
    createAuthProvider({
        accessTokenKey: 'access_token',
        userTokenKey: 'user_token',
        onUpdateToken: (token) => fetch('/auth/refresh', {
            method: 'POST',
            body: token.refreshToken,
        })
        .then(r => r.json())
    })