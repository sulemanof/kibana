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

import { DateRangeValues } from '../../../agg_types/controls/date_ranges';
import { Bounds } from '../../../agg_types/controls/extended_bounds';
import { FieldParamType, SelectValueProp } from '../../../agg_types/param_types';
import { FilterValue } from '../../../agg_types/controls/filters';
import { IpRangeTypes } from '../../../agg_types/controls/ip_range_type';
import { IpRange } from '../../../agg_types/controls/ip_ranges';
import { RangeValues } from '../../../agg_types/controls/ranges';
import { AggregateValueProp } from '../../../agg_types/controls/top_aggregate';
import { AggConfig } from '../../agg_config';

export type AggParamType =
  | string
  | number
  | boolean
  | undefined
  | DateRangeValues[]
  | Bounds
  | FieldParamType
  | SelectValueProp
  | FilterValue[]
  | IpRangeTypes
  | IpRange
  | RangeValues
  | AggregateValueProp
  | AggConfig
  | '';

export interface AggParams {
  [key: string]: AggParamType;
}
