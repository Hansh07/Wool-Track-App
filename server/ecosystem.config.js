module.exports = {
    apps: [
        {
            name: 'wool-server',
            script: 'src/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: { NODE_ENV: 'development' },
            env_production: { NODE_ENV: 'production', PORT: 5000 },
            max_memory_restart: '500M',
            error_file: './logs/pm2-error.log',
            out_file: './logs/pm2-out.log',
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            watch: false,
            autorestart: true,
            max_restarts: 10,
            restart_delay: 3000,
        },
    ],
};
