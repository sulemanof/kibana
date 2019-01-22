/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import AbstractSearchStrategy from './strategies/abstract_search_strategy';
import AbstractSearchRequest from './searh_requests/abstract_request';
import DefaultSearchStrategy from './strategies/default_search_strategy';
import DefaultSearchCapabilities from './default_search_capabilities';

const strategies = [];

export default class SearchStrategiesRegister {
  static init(server) {
    SearchStrategiesRegister.add(new DefaultSearchStrategy(server));

    server.expose('AbstractSearchStrategy', AbstractSearchStrategy);
    server.expose('AbstractSearchRequest', AbstractSearchRequest);
    server.expose('DefaultSearchCapabilities', DefaultSearchCapabilities);

    server.expose('addSearchStrategy', (searchStrategy) => SearchStrategiesRegister.add(searchStrategy));
  }

  static add(searchStrategy) {
    if (searchStrategy instanceof AbstractSearchStrategy) {
      strategies.unshift(searchStrategy);
    }
    return this;
  }

  static async getViableStrategy(req, indexPattern) {
    for (const searchStrategy of strategies) {
      const { isViable, capabilities } = await searchStrategy.checkForViability(req, indexPattern);

      if (isViable) {
        return {
          searchStrategy,
          capabilities,
        };
      }
    }
  }
}
