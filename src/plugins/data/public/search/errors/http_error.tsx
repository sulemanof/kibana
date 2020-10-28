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

import { EuiCodeBlock, EuiSpacer } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React from 'react';

export function getHttpError(message: string) {
  return (
    <>
      {i18n.translate('data.errors.fetchError', {
        defaultMessage:
          'Check your network and proxy configuration. If the problem persists, contact your network administrator.',
      })}
      <EuiSpacer size="s" />
      <EuiSpacer size="s" />
      <EuiCodeBlock data-test-subj="errMessage" isCopyable={true} paddingSize="s">
        {message}
      </EuiCodeBlock>
    </>
  );
}
