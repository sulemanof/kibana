/*
* Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
* or more contributor license agreements. Licensed under the Elastic License;
* you may not use this file except in compliance with the Elastic License.
*/
import { indexBy, isString } from 'lodash';
import { callWithRequestFactory } from '../call_with_request_factory';
import mergeCapabilitiesWithFields from '../merge_capabilities_with_fields';
import { getCapabilitiesForRollupIndices } from '../map_capabilities';

const ROLLUP_INDEX_CAPABILITIES_METHOD = 'rollup.rollupIndexCapabilities';
const DEFAULT_INDEX_PATTERN = '*';
const batchRequestsSupport = false;

const getRollupIndices = rollupData => Object.keys(rollupData);
const isIndexPatternValid = indexPattern => isString(indexPattern) && indexPattern !== DEFAULT_INDEX_PATTERN;

export default (AbstractSearchStrategy, RollupSearchRequest, RollupSearchCapabilities) =>
  (class RollupSearchStrategy extends AbstractSearchStrategy {
    name = 'rollup';

    constructor(server) {
      super(server, callWithRequestFactory, RollupSearchRequest);
    }

    async getRollupData(req, indexPattern) {
      const callWithRequest = this.getCallWithRequestInstance(req);
      return await callWithRequest(ROLLUP_INDEX_CAPABILITIES_METHOD, {
        indexPattern,
      });
    }

    async checkForViability(req, indexPattern = DEFAULT_INDEX_PATTERN) {
      let isViable = false;
      let capabilities = null;

      if (isIndexPatternValid(indexPattern)) {
        const rollupData = await this.getRollupData(req, indexPattern);
        const rollupIndices = getRollupIndices(rollupData);

        isViable = rollupIndices.length === 1;

        if (isViable) {
          const [rollupIndex] = rollupIndices;
          const fieldsCapabilities = getCapabilitiesForRollupIndices(rollupData);

          capabilities = new RollupSearchCapabilities(req, batchRequestsSupport, fieldsCapabilities, rollupIndex);
        }
      }

      return {
        isViable,
        capabilities,
      };
    }

    async getFieldsForWildcard(req, indexPattern, { fieldsCapabilities, rollupIndex }) {
      const fields = await super.getFieldsForWildcard(req, indexPattern);

      const fieldsFromFieldCapsApi = indexBy(fields, 'name');
      const rollupIndexCapabilities = fieldsCapabilities[rollupIndex].aggs;

      return mergeCapabilitiesWithFields(rollupIndexCapabilities, fieldsFromFieldCapsApi);
    }
  });
