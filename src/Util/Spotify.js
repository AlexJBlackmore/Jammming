let accessToken;
const clientID = 'b817f02e2a2243208a9a1d5087e3ee0f';
const redirectURI = 'http://localhost:3000/';

const Spotify = {


    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }
        
        const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (hasAccessToken && hasExpiresIn) {
            accessToken = hasAccessToken[1];
            const expiresIn = Number(hasExpiresIn[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessUrl;
        }
    },

    // getAccessToken() {
    //     if(accessToken) {
    //         return accessToken;
    //     } 
        
    //     const hasAccessToken = window.location.href.match(/expires_in=([^&]*)/);
    //     const hasExpiresIn = window.location.href.match(/access_token=([^&]*)/);

    //     if ( hasAccessToken && hasExpiresIn ){
            
    //         const tokenExpiresIn = Number(hasExpiresIn[1]);

    //         accessToken = hasAccessToken[1];

    //         window.setTimeout(() => accessToken = '', tokenExpiresIn * 1000);

    //         window.history.pushState('Access Token', null, '/');

    //         return accessToken;

    //     } else {
    //         window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`

    //         // Should return be here? return? name artist album ui
    //     }
    // },

    // Uses access token to return a response from the Spoitify API using user serach term from SearchBar
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(
            response => { 
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('API request failed');
                }
        }).then(
            jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                cover: track.album.images[2].url,
                preview: track.preview_url
            }));
        });
    },

    // search(term) {
    //     const accessToken = Spotify.getAccessToken();
    //     return fetch(`https://api.spotify.com/v1/search?type=TRACK&q=${term}`, {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`
    //         }
    //     }).then(
    //         response => {
    //             if (response.ok) {
    //                 return response.json();
    //             } else {
    //                 console.log('API request failed');
    //             }
                
    //     }).then(
    //         jsonResponse => {

    //             if(!jsonResponse.tracks) {
    //                 return [];
    //         }

    //         return jsonResponse.tracks.items.map(item => ({
    //                 id: item.id,
    //                 name: item.name,
    //                 artist: item.artists[0].name,
    //                 album: item.album.name,
    //                 uri: item.uri
    //         }));
    //     });
    // },
     

    // Gets a user's ID from Spotify, creates a new playlist on user's account, and adds tracks to that playlist
    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;

        // Return user's ID from Spotify API
        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(
            response => {
                if(response.ok) {
                    return response.json();
                } 
        }).then(
            jsonResponse => {
                userId = jsonResponse.id;

                // Adds playlist to user's account
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                }).then(
                    response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log('API request failed');
                    }
                }).then(
                    jsonResponse => {
                        const playlistId = jsonResponse.id;

                        // Adds tracks to new playlist 
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackURIs})
                        });
                    });
            });
    }

    // savePlaylist(playlistName, playlistURIs) {
    //     if (playlistName && playlistURIs.length) {
    //         const accTok = Spotify.getAccessToken();
    //         const headers = {
    //             Authorization: `Bearer ${accTok}`                
    //         }
    //         let userID = '';

    //         // Returns user's ID from Spotify API
    //         fetch(`https://api.spotify.com/v1/users/${headers.userID}`, {
    //             headers: headers
    //         }).then(
    //             response => {
    //                 if (response.ok) {
    //                     return response.json();
    //                 }
    //         }).then(
    //             jsonResponse => {
    //                 userID = jsonResponse.id;

    //                 // Adds playlist to user's account
    //                 return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
    //                     method: 'POST',
    //                     headers: headers,
    //                     body: JSON.stringify({name: playlistName})
    //             }).then(
    //                 response => {
    //                     fetch(`https://api.spotify.com/v1/playlists/${response.id}/tracks`, {
    //                         method: 'POST',
    //                         headers: {Authorization: accTok, 'Content-type': 'application/json'},
    //                         body: {
    //                             "uris": playlistURIs
    //                         }
    //                 }).then(response => {
    //                     return response.json();
    //                 }).then(jsonResponse => {
    //                     const playlistID = jsonResponse.snapshot_id;
    //                     return playlistID;
    //                 })
    //             })

    //         });
            
    //     } else {
    //         return;
    //     }
    // }
}

export default Spotify;