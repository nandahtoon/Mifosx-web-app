/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const assert = require('node:assert/strict');
const { once } = require('node:events');
const http = require('node:http');
const test = require('node:test');
const sockjs = require('sockjs');

test('SockJS preserves unique v4 connection IDs and WebSocket echo', { timeout: 10000 }, async (t) => {
  const server = http.createServer();
  const endpoint = sockjs.createServer({ log() {} });
  const connections = [];
  const clients = [];
  const upgradedSockets = [];

  endpoint.on('connection', (connection) => {
    connections.push(connection);
    connection.on('data', (data) => connection.write(data));
  });
  endpoint.installHandlers(server, { prefix: '/compat' });
  server.on('upgrade', (_request, socket) => upgradedSockets.push(socket));
  t.after(() => {
    clients.forEach((client) => client.close());
    upgradedSockets.forEach((socket) => socket.destroy());
    server.close();
  });

  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const url = `ws://127.0.0.1:${server.address().port}/compat/websocket`;
  const signal = AbortSignal.timeout(8000);

  for (const payload of [
    'first synthetic connection',
    'second synthetic connection'
  ]) {
    const client = new WebSocket(url);
    clients.push(client);
    await once(client, 'open', { signal });
    const reply = once(client, 'message', { signal });
    client.send(payload);
    const [message] = await reply;
    assert.equal(message.data, payload);
    const closed = once(client, 'close', { signal });
    client.close();
    await closed;
  }

  assert.equal(connections.length, 2);
  assert.equal(new Set(connections.map((connection) => connection.id)).size, 2);
  for (const connection of connections) {
    assert.match(connection.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  }
});
