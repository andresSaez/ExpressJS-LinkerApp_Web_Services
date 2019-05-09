

export const environment = {
    production: false,
    token: {
        secret: 'linkerapp',
        expiresIn: '2 hours'
    },
    database: {
        host: 'localhost',
        port: '27017',
        database: 'linker'
    },
    server_port: Number( process.env.PORT || 5000 ),
    prefix: '/api/v1',
    oneSignal: {
        userAuthKey: 'NjFmNWE5M2ItMzRlZi00ZGUwLTg4MGEtN2YxYTA5YWQzNTQ1',
        appAuthKey: 'ZmJlNmU4NTUtZDNmYy00MDQ5LTkwOGUtMDE4OWNmOTRlMTQw',
        appId: 'ea9a1f32-879f-4c2a-8e35-f4123c5b06c0'
    }
};