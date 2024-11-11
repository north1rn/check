document.getElementById('ipForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const ipAddress = document.getElementById('ipAddress').value;
    const resultDiv = document.getElementById('result');
    const warningDiv = document.getElementById('warning');

    resultDiv.innerHTML = 'Завантаження...';

    try {
        const response = await fetch(`/geolocate?ip=${ipAddress}`);
        const data = await response.json();
        if (data.error) {
            resultDiv.innerHTML = `Помилка: ${data.error}`;
        } else {
            resultDiv.innerHTML = `
                <p><strong>IP:</strong> ${data.ip}</p>
                <p><strong>Місто:</strong> ${data.city}</p>
                <p><strong>Країна:</strong> ${data.country}</p>
                <p><strong>Координати:</strong> ${data.latitude}, ${data.longitude}</p>
                <p><strong>Це проксі або VPN:</strong> ${data.isProxy}</p>
            `;
            warningDiv.innerHTML = 'Увага: відкриття вашої IP-адреси може призвести до витоку конфіденційної інформації!';
        }
    } catch (error) {
        resultDiv.innerHTML = 'Помилка при обробці запиту.';
    }
});
