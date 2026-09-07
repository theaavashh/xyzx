import type { Server as HttpServer } from 'http';
import type { Socket } from 'net';
import crypto from 'crypto';
import { logger } from '../utils/logger';

const MAGIC_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const OPCODE_CONTINUATION = 0x0;
const OPCODE_TEXT = 0x1;
const OPCODE_CLOSE = 0x8;
const OPCODE_PING = 0x9;
const OPCODE_PONG = 0xa;

interface WebSocketClient {
  socket: Socket;
  isAlive: boolean;
}

interface ParsedFrame {
  opcode: number;
  payload: Buffer;
  consumed: number;
}

const clients = new Set<WebSocketClient>();
let initialized = false;

export const initWebSocket = (server: HttpServer): void => {
  if (initialized) return;
  initialized = true;

  server.on('upgrade', (req, socket: Socket) => {
    const key = req.headers['sec-websocket-key'];
    if (typeof key !== 'string') {
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
      return;
    }

    const accept = crypto
      .createHash('sha1')
      .update(key + MAGIC_GUID)
      .digest('base64');

    socket.write(
      'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
    );

    const client: WebSocketClient = { socket, isAlive: true };
    clients.add(client);
    logger.info('WebSocket client connected', { total: clients.size });

    let buffer = Buffer.alloc(0);

    const onData = (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (true) {
        const frame = parseFrame(buffer);
        if (!frame) break;
        buffer = buffer.subarray(frame.consumed);
        handleFrame(client, frame);
      }
    };

    socket.on('data', onData);
    socket.on('error', () => removeClient(client));
    socket.on('close', () => removeClient(client));
  });

  const heartbeat = setInterval(() => {
    for (const client of clients) {
      if (!client.isAlive) {
        removeClient(client);
        continue;
      }
      client.isAlive = false;
      sendFrame(client, OPCODE_PING, Buffer.alloc(0));
    }
  }, 30000);
  heartbeat.unref();
};

export const broadcastNewOrder = (order: unknown): void => {
  const payload = Buffer.from(
    JSON.stringify({ type: 'new-order', data: order }),
  );
  for (const client of clients) {
    sendFrame(client, OPCODE_TEXT, payload);
  }
};

export const closeWebSocket = (): void => {
  for (const client of clients) {
    try {
      client.socket.end();
    } catch {
      // ignore
    }
  }
  clients.clear();
  initialized = false;
};

const removeClient = (client: WebSocketClient): void => {
  if (clients.delete(client)) {
    logger.info('WebSocket client disconnected', { total: clients.size });
  }
};

const handleFrame = (client: WebSocketClient, frame: ParsedFrame): void => {
  switch (frame.opcode) {
    case OPCODE_PING:
      sendFrame(client, OPCODE_PONG, frame.payload);
      break;
    case OPCODE_PONG:
      client.isAlive = true;
      break;
    case OPCODE_CLOSE:
      removeClient(client);
      try {
        client.socket.end();
      } catch {
        // ignore
      }
      break;
    default:
      break;
  }
};

const parseFrame = (buffer: Buffer): ParsedFrame | null => {
  if (buffer.length < 2) return null;

  const opcode = buffer.readUInt8(0) & 0x0f;
  const masked = (buffer.readUInt8(1) & 0x80) !== 0;
  let payloadLength = buffer.readUInt8(1) & 0x7f;
  let offset = 2;

  if (payloadLength === 126) {
    if (buffer.length < 4) return null;
    payloadLength = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLength === 127) {
    if (buffer.length < 10) return null;
    const big = buffer.readBigUInt64BE(2);
    if (big > BigInt(Number.MAX_SAFE_INTEGER)) return null;
    payloadLength = Number(big);
    offset = 10;
  }

  const maskOffset = offset;
  if (masked) offset += 4;

  if (buffer.length < offset + payloadLength) return null;

  let payload = buffer.subarray(offset, offset + payloadLength);
  if (masked) {
    const maskKey = buffer.subarray(maskOffset, maskOffset + 4);
    payload = unmask(payload, maskKey);
  }

  return { opcode, payload, consumed: offset + payloadLength };
};

const unmask = (payload: Buffer, maskKey: Buffer): Buffer => {
  const out = Buffer.allocUnsafe(payload.length);
  for (let i = 0; i < payload.length; i++) {
    out[i] = payload.readUInt8(i) ^ maskKey.readUInt8(i % 4);
  }
  return out;
};

const sendFrame = (client: WebSocketClient, opcode: number, payload: Buffer): void => {
  if (client.socket.destroyed) {
    removeClient(client);
    return;
  }

  const header = Buffer.alloc(10);
  header[0] = 0x80 | opcode;
  let offset = 1;

  if (payload.length < 126) {
    header[1] = payload.length;
    offset = 2;
  } else if (payload.length <= 0xffff) {
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
    offset = 4;
  } else {
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(payload.length), 2);
    offset = 10;
  }

  try {
    client.socket.write(Buffer.concat([header.subarray(0, offset), payload]));
  } catch {
    removeClient(client);
  }
};
