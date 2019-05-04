/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

/** Represents the Timeline data providers */
export interface DataProvider {
  /** Uniquely identifies a data provider */
  id: string;
  /** Human readable */
  name: string;
  /**
   * When `false`, a data provider is temporarily disabled, but not removed from
   * the timeline. default: `true`
   */
  enabled: boolean;
  /**
   * When `true`, a data provider is excluding the match, but not removed from
   * the timeline. default: `false`
   */
  excluded: boolean;
  /**
   * Return the KQL query who have been added by user
   */
  kqlQuery: string;
  /**
   * Returns a query properties that, when executed, returns the data for this provider
   */
  queryMatch: {
    field: string;
    displayField?: string;
    value: string | number;
    displayValue?: string | number;
  };
  /**
   * Additional query clauses that are ANDed with this query to narrow results
   */
  and: DataProvider[];
}
