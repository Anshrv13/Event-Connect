import fs from 'fs';
import path from 'path';

export const logFile = (req, res, next) => {
    const timestamp = new Date().toISOString();

    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    
    res.on('finish', () => {
        const status = res.statusCode;
        const contentLength = res.get('Content-Length') || 0;

        const logMessage = `${timestamp} - ${ip} - ${method} ${url} ${status} ${contentLength} - ${userAgent} - ${req.headers.referer} - ${req.headers['x-forwarded-for'] || ''} \n`;
        // console.log(logMessage);

        fs.appendFile(path.resolve('access.log'), logMessage, (err) => {
            if (err) {
                console.error('Error writing log to file:', err);
            }
        });
    });

    next();
};