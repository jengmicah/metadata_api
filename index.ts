import App from './app';
import * as http from "http";

const port = 3070;

  App.set('port', port);
  const server = http.createServer(App);
  server.listen(port);

server.on('listening', function(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
 });

module.exports = App;