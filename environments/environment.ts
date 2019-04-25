

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
    prefix: '/api/v1'
};