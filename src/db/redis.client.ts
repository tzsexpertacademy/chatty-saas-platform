/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename redis.client.ts                                                    │
 * │ Developed by: Cleber Wilson                                                  │
 * │ Creation date: Apr 09, 2023                                                  │
 * │ Contact: contato@codechat.dev                                                │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @copyright © Cleber Wilson 2023. All rights reserved.                        │
 * │ Licensed under the Apache License, Version 2.0                               │
 * │                                                                              │
 * │  @license "https://github.com/code-chat-br/whatsapp-api/blob/main/LICENSE"   │
 * │                                                                              │
 * │ You may not use this file except in compliance with the License.             │
 * │ You may obtain a copy of the License at                                      │
 * │                                                                              │
 * │    http://www.apache.org/licenses/LICENSE-2.0                                │
 * │                                                                              │
 * │ Unless required by applicable law or agreed to in writing, software          │
 * │ distributed under the License is distributed on an "AS IS" BASIS,            │
 * │ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.     │
 * │                                                                              │
 * │ See the License for the specific language governing permissions and          │
 * │ limitations under the License.                                               │
 * │                                                                              │
 * │ @class RedisCache                                                            │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { createClient, RedisClientType } from '@redis/client';
import { Logger } from '../config/logger.config';
import { BufferJSON } from '@whiskeysockets/baileys';
import { Redis } from '../config/env.config';

export class RedisCache {
  constructor() {
    process.on('beforeExit', async () => {
      if (this.statusConnection) {
        await this.client.disconnect();
      }
    });
  }

  private statusConnection = false;
  private instanceName: string;
  private redisEnv: Redis;

  public set reference(reference: string) {
    this.instanceName = reference;
  }

  public async connect(redisEnv: Redis) {
    this.client = createClient({ url: redisEnv.URI });
    await this.client.connect();
    this.statusConnection = true;
    this.redisEnv = redisEnv;
  }

  private readonly logger = new Logger(RedisCache.name);
  private client: RedisClientType;

  public async instanceKeys(): Promise<string[]> {
    try {
      return await this.client.sendCommand(['keys', this.redisEnv.PREFIX_KEY + ':*']);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async keyExists(key?: string) {
    if (key) {
      return !!(await this.instanceKeys()).find((i) => i === key);
    }
    return !!(await this.instanceKeys()).find((i) => i === this.instanceName);
  }

  public async writeData(field: string, data: any) {
    try {
      const json = JSON.stringify(data, BufferJSON.replacer);
      return await this.client.hSet(
        this.redisEnv.PREFIX_KEY + ':' + this.instanceName,
        field,
        json,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async readData(field: string) {
    try {
      const data = await this.client.hGet(
        this.redisEnv.PREFIX_KEY + ':' + this.instanceName,
        field,
      );
      if (data) {
        return JSON.parse(data, BufferJSON.reviver);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async removeData(field: string) {
    try {
      return await this.client.hDel(
        this.redisEnv.PREFIX_KEY + ':' + this.instanceName,
        field,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async delAll(hash?: string) {
    try {
      return await this.client.del(
        hash || this.redisEnv.PREFIX_KEY + ':' + this.instanceName,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
