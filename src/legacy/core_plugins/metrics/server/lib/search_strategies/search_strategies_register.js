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
import { findLast } from 'lodash';
import AbstractSearchStrategy from './strategies/abstract_search_strategy';
import DefaultSearchStrategy from './strategies/default_search_strategy';

const strategies = [];

export default class SearchStrategiesRegister {
  add(searchStrategy) {
    if (searchStrategy instanceof AbstractSearchStrategy) {
      strategies.push(searchStrategy);
    }
    return this;
  }

  static init(server) {
    const searchStrategiesRegister = new SearchStrategiesRegister();

    server.expose('addSearchStrategy', (searchStrategy) => searchStrategiesRegister.add(searchStrategy));

    return searchStrategiesRegister.add(new DefaultSearchStrategy(server));
  }

  static getStrategyForIndex(indexPattern) {
    return findLast(strategies, searchStrategy => {
      return searchStrategy.isViable(indexPattern);
    });
  }
}
