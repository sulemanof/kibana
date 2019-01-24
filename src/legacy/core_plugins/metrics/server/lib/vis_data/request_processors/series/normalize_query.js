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
const { set, get, isEmpty } = require('lodash');

const isEmptyFilter = (filter = {}) => Boolean(filter.match_all) && isEmpty(filter.match_all);

function removeEmptyTopLevelAggregation(doc, series) {
  const filter = get(doc, `aggs.${series.id}.filter`);

  if (isEmptyFilter(filter)) {
    const meta = get(doc, `aggs.${series.id}.meta`);
    set(doc, `aggs`, doc.aggs[series.id].aggs);
    set(doc, `aggs.timeseries.meta`, meta);
  }

  return doc;
}

export default function normalizeQuery(req, panel, series) {
  return next => doc => {
    return next(removeEmptyTopLevelAggregation(doc, series));
  };
}
