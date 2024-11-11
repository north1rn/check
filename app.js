const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

// Додайте маршрут для кореневої сторінки
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Надсилаємо HTML-файл
});

// Ваш існуючий маршрут для перевірки геолокації з додаванням перевірки VPN/проксі
app.get('/geolocate', async (req, res) => {
    const ip = req.query.ip;
    if (!ip) {
        return res.json({ error: 'IP-адреса обов\'язкова' });
    }

    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(`https://ipinfo.io/${ip}/json?token=8176575105c696`); // Замініть YOUR_API_KEY
        const data = await response.json();
        
        // Виводимо весь об'єкт даних у консоль
        console.log(data);

        if (data.error) {
            res.json({ error: data.error });
        } else {
            const isProxy = data.proxy || data.vpn || false; // Перевірте, чи є це проксі чи VPN
            res.json({
                ip: data.ip,
                city: data.city,
                country: data.country,
                latitude: data.loc.split(',')[0],
                longitude: data.loc.split(',')[1],
                isProxy: isProxy ? 'Так' : 'Ні', // Додамо інформацію про VPN/проксі
            });
        }
    } catch (error) {
        res.json({ error: 'Не вдалося отримати дані' });
    }
});


// Додайте обробку помилок при запуску сервера
app.listen(PORT, (err) => {
    if (err) {
        console.error('Не вдалося запустити сервер:', err);
    } else {
        console.log(`Сервер запущений на порту ${PORT}`);
    }
});
