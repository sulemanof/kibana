/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiEmptyPrompt, EuiFlexGroup, EuiPageContent } from '@elastic/eui';
import React from 'react';

import { FormattedMessage } from '@kbn/i18n/react';

export const PermissionDenied = () => (
  <EuiFlexGroup gutterSize="none">
    <EuiPageContent horizontalPosition="center">
      <EuiEmptyPrompt
        iconType="securityApp"
        title={
          <h2>
            <FormattedMessage
              id="xpack.security.management.roleMappings.deniedPermissionTitle"
              defaultMessage="You need permission to manage role mappings"
            />
          </h2>
        }
        body={
          <p data-test-subj="permissionDeniedMessage">
            <FormattedMessage
              id="xpack.security.management.roleMappings.deniedPermissionDescription"
              defaultMessage="Contact your system administrator."
            />
          </p>
        }
      />
    </EuiPageContent>
  </EuiFlexGroup>
);
