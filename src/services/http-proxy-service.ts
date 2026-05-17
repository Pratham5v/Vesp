import {
  ProxyRequest,
  ProxyResponse,
} from '@app/interfaces/http-proxy.interface';
import axios, { AxiosResponse } from 'axios';

// Handles forwarding of http request from tunnel server to the localservice running on localhost

export class HttpProxy {
  private localPort: number;

  constructor(localPort: number) {
    this.localPort = localPort;
  }

  private filterHeaders(
    headers: Record<string, string | string[]>,
  ): Record<string, string | string[]> {
    const filtered: Record<string, string | string[]> = {};

    const excludeHeaders = new Set([
      'host',
      'connection',
      'transfer-encoding',
      'content-length', // axios will set this
    ]);

    Object.entries(headers).forEach(([key, value]) => {
      if (!excludeHeaders.has(key.toLowerCase())) {
        filtered[key] = value;
      }
    });

    return filtered;
  }

  async forwardRequest(request: ProxyRequest): Promise<ProxyResponse> {
    try {
      const queryString = request.query ? `?${request.query}` : '';
      const url = `http://${this.localPort}${request.path}${queryString}`;

      // Forwarding request to local service
      const response: AxiosResponse = await axios({
        method: request.method,
        url,
        headers: this.filterHeaders(request.headers),
        data: request.body.length > 0 ? request.body : undefined,
        responseType: 'arraybuffer',
        maxRedirects: 0,
        validateStatus: () => true,
      });

      return {
        statusCode: response.status,
        statusMessage: response.statusText,
        headers: response.headers as Record<string, string | string[]>,
        body: Buffer.from(response.data),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error(
            `Could not connect to local service on port ${this.localPort}`,
          );
        } else if (
          error.code === 'ETIMEDOUT' ||
          error.code === 'ECONNECTIONABORTED'
        ) {
          throw new Error('Request to local service timed out');
        }
      }

      throw error;
    }
  }
}
