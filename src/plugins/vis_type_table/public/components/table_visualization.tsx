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

import './table_visualization.scss';
import React, { useEffect } from 'react';
import classNames from 'classnames';

import { CoreSetup } from 'kibana/public';
import { ReactVisComponentProps } from 'src/plugins/visualizations/public';
import { KibanaContextProvider } from '../../../kibana_react/public';
import { TableVisParams } from '../types';
import { TableContext } from '../table_vis_response_handler';
import { TableVisBasic } from './table_vis_basic';
import { TableVisSplit } from './table_vis_split';

export const createTableVisualizationComponent = (core: CoreSetup) => ({
  renderComplete,
  vis,
  visData: { direction, table, tables },
  visParams,
}: ReactVisComponentProps<TableContext, TableVisParams>) => {
  useEffect(() => {
    renderComplete();
  }, [renderComplete]);

  const className = classNames('tbvChart', {
    tbvChart__splitColumns: direction === 'column',
  });

  return (
    <KibanaContextProvider services={core}>
      <div className={className} data-test-subj="tableVis">
        {table ? (
          <TableVisBasic table={table} vis={vis} visParams={visParams} />
        ) : (
          <TableVisSplit tables={tables} vis={vis} visParams={visParams} />
        )}
      </div>
    </KibanaContextProvider>
  );
};
