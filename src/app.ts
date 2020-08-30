import express from 'express';
import * as bodyParser from 'body-parser';
import { AddressInfo } from 'net'

async function startServer() {
    const app = express();
    app.use(bodyParser.json({
        limit: '50mb',
        verify(req: any, res, buf, encoding) {
            req.rawBody = buf;
        }
    }));

    const server = app.listen(5000, '0.0.0.0', () => {
        const { port, address } = server.address() as AddressInfo;
        console.log('Server listening on:', 'http://' + address + ':' + port);
    });
}

startServer();
