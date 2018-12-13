/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { i18n } from '@kbn/i18n';

export const functionErrors = {
  alterColumn: {
    columnNotFound: (column: string) =>
      new Error(
        i18n.translate('xpack.canvas.functions.alterColumn.columnNotFoundErrorMessage', {
          defaultMessage: "Column not found: '{column}'",
          values: {
            column,
          },
        })
      ),
    typeConvertFailure: (type: string) =>
      new Error(
        i18n.translate('xpack.canvas.functions.alterColumn.convertToTypeErrorMessage', {
          defaultMessage: 'Cannot convert to {type}',
          values: { type },
        })
      ),
  },
  axisConfig: {
    positionInvalid: (position: string) =>
      new Error(
        i18n.translate('xpack.canvas.functions.axisConfig.invalidPositionErrorMessage', {
          defaultMessage: 'Invalid position {position}',
          values: {
            position,
          },
        })
      ),
    minInvalid: (min: string) =>
      new Error(
        i18n.translate('xpack.canvas.functions.axisConfig.minArgTypeErrorMessage', {
          defaultMessage: `Invalid date string '{min}' found. '{minConfig}' must be a number, date in ms, or {isoFormat} date string`,
          values: {
            min,
            minConfig: 'min',
            isoFormat: 'ISO8601',
          },
        })
      ),
    maxInvalid: (max: string) =>
      new Error(
        i18n.translate('xpack.canvas.functions.axisConfig.maxArgTypeErrorMessage', {
          defaultMessage: `Invalid date string '{max}' found. '{maxConfig}' must be a number, date in ms, or {isoFormat} date string`,
          values: {
            max,
            maxConfig: 'max',
            isoFormat: 'ISO8601',
          },
        })
      ),
  },
  compare: {
    operatorInvalid: () =>
      new Error(
        i18n.translate('xpack.canvas.functions.compare.invalidCompareOperatorErrorMessage', {
          defaultMessage:
            'Invalid compare operator. Use {validCompareOperatorsList} or {gteOperator}.',
          values: {
            validCompareOperatorsList: 'eq, ne, lt, gt, lte,',
            gteOperator: 'gte',
          },
        })
      ),
  },
  containerStyle: {
    backgroundImageInvalid: () =>
      new Error(
        i18n.translate('xpack.canvas.functions.containerStyle.invalidBackgroundImageErrorMessage', {
          defaultMessage: 'Invalid backgroundImage. Please provide an asset or a URL.',
        })
      ),
  },
  date: {
    dateInvalid: (date: string) =>
      new Error(
        i18n.translate('xpack.canvas.functions.date.invalidDateInputErrorMessage', {
          defaultMessage: 'Invalid date input: {date}',
          values: { date },
        })
      ),
  },
};
