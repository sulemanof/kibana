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

import React, { useReducer, useEffect } from 'react';

import { EuiForm, EuiAccordion, EuiSpacer } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { aggTypes, AggType, AggParam } from 'ui/agg_types';
import { AggConfig, Vis, VisState } from 'ui/vis';
import { IndexPattern } from 'ui/index_patterns';
import { DefaultEditorAggSelect } from './default_editor_agg_select';
import { DefaultEditorAggParam } from './default_editor_agg_param';
import {
  getAggParamsToRender,
  getError,
  getAggTypeOptions,
  ParamInstance,
  getFormTouched,
} from './default_editor_agg_params_helper';
import {
  aggTypeReducer,
  AGG_TYPE_ACTION_KEYS,
  aggParamsReducer,
  AGG_PARAMS_ACTION_KEYS,
  initAggParamsState,
  AggParamsItem,
} from './default_editor_agg_params_state';

import { editorConfigProviders } from '../../config/editor_config_providers';
import { FixedParam, TimeIntervalParam, EditorParamConfig } from '../../config/types';

const FIXED_VALUE_PROP = 'fixedValue';
const DEFAULT_PROP = 'default';
type EditorParamConfigType = EditorParamConfig & {
  [key: string]: any;
};
export interface SubAggParamsProp {
  formIsTouched: boolean;
  vis: Vis;
  onAggParamsChange: (agg: AggConfig, paramName: string, value: any) => void;
  onAggTypeChange: (agg: AggConfig, aggType: AggType) => void;
  onAggErrorChanged: (agg: AggConfig, error?: string) => void;
}
interface DefaultEditorAggParamsProps extends SubAggParamsProp {
  agg: AggConfig;
  aggIndex?: number;
  aggIsTooLow?: boolean;
  className?: string;
  groupName: string;
  indexPattern: IndexPattern;
  responseValueAggs: AggConfig[] | null;
  state: VisState;
  callbacks: {
    setTouched: (isTouched: boolean) => void;
    setValidity: (isValid: boolean) => void;
    onAggParamsChange: (agg: AggConfig, paramName: string, value: any) => void;
    onAggTypeChange: (agg: AggConfig, aggType: AggType) => void;
    onAggErrorChanged: (agg: AggConfig, error?: string) => void;
  };
}

function DefaultEditorAggParams({
  agg,
  aggIndex = 0,
  aggIsTooLow = false,
  className,
  groupName,
  formIsTouched,
  indexPattern,
  responseValueAggs,
  state = {} as VisState,
  vis,
  callbacks,
}: DefaultEditorAggParamsProps) {
  const {
    onAggParamsChange,
    onAggTypeChange,
    setTouched,
    setValidity,
    onAggErrorChanged,
  } = callbacks;
  const groupedAggTypeOptions = getAggTypeOptions(agg, indexPattern, groupName);
  const errors = getError(agg, aggIsTooLow);

  const editorConfig = editorConfigProviders.getConfigForAgg(
    aggTypes.byType[groupName],
    indexPattern,
    agg
  );
  const params = getAggParamsToRender({ agg, editorConfig, responseValueAggs, state }, vis);
  const allParams = [...params.basic, ...params.advanced];
  const [aggParams, onChangeAggParams] = useReducer(
    aggParamsReducer,
    allParams,
    initAggParamsState
  );
  const [aggType, onChangeAggType] = useReducer(aggTypeReducer, { touched: false, validity: true });

  const isFormValid =
    aggType.validity &&
    Object.keys(aggParams).every((paramsName: string) => aggParams[paramsName].validity);
  const isReactFormTouched = getFormTouched(agg.type, aggType, aggParams);

  useEffect(
    () => {
      Object.keys(editorConfig).forEach(param => {
        const paramConfig = editorConfig[param];
        const paramOptions = agg.type.params.find(
          (paramOption: AggParam) => paramOption.name === param
        );

        const hasFixedValue = paramConfig.hasOwnProperty(FIXED_VALUE_PROP);
        const hasDefault = paramConfig.hasOwnProperty(DEFAULT_PROP);
        // If the parameter has a fixed value in the config, set this value.
        // Also for all supported configs we should freeze the editor for this param.
        if (hasFixedValue || hasDefault) {
          let newValue;
          let property = FIXED_VALUE_PROP;
          let typedParamConfig: EditorParamConfigType = paramConfig as FixedParam;

          if (hasDefault) {
            property = DEFAULT_PROP;
            typedParamConfig = paramConfig as TimeIntervalParam;
          }

          if (paramOptions && paramOptions.deserialize) {
            newValue = paramOptions.deserialize(typedParamConfig[property]);
          } else {
            newValue = typedParamConfig[property];
          }
          onAggParamsChange(agg, param, newValue);
        }
      });
    },
    [editorConfig]
  );

  useEffect(
    () => {
      setTouched(false);
    },
    [agg.type]
  );

  useEffect(
    () => {
      setValidity(isFormValid);
    },
    [isFormValid, agg.type]
  );

  useEffect(
    () => {
      // when all invalid controls were touched or they are untouched
      setTouched(!!isReactFormTouched);
    },
    [isReactFormTouched]
  );

  const renderParam = (paramInstance: ParamInstance, model: AggParamsItem) => {
    return (
      <DefaultEditorAggParam
        key={`${paramInstance.aggParam.name}${agg.type ? agg.type.name : ''}`}
        showValidation={formIsTouched || model.touched ? !model.validity : false}
        onChange={onAggParamsChange}
        setValidity={validity => {
          onChangeAggParams({
            type: AGG_PARAMS_ACTION_KEYS.VALIDITY,
            paramName: paramInstance.aggParam.name,
            payload: validity,
          });
        }}
        // setTouched can be called from sub-agg which passes a parameter
        setTouched={(isTouched: boolean = true) => {
          onChangeAggParams({
            type: AGG_PARAMS_ACTION_KEYS.TOUCHED,
            paramName: paramInstance.aggParam.name,
            payload: isTouched,
          });
        }}
        subAggParams={{
          onAggParamsChange,
          onAggTypeChange,
          onAggErrorChanged,
          formIsTouched,
          vis,
        }}
        {...paramInstance}
      />
    );
  };

  return (
    <EuiForm
      className={className}
      isInvalid={!!errors.length}
      error={errors}
      data-test-subj={`visAggEditorParams${agg.id}`}
    >
      <DefaultEditorAggSelect
        aggError={agg.error}
        id={agg.id}
        indexPattern={indexPattern}
        value={agg.type}
        aggTypeOptions={groupedAggTypeOptions}
        isSubAggregation={aggIndex >= 1 && groupName === 'buckets'}
        showValidation={formIsTouched || aggType.touched ? !aggType.validity : false}
        setValue={value => {
          onAggTypeChange(agg, value);
          // reset touched and validity of params
          onChangeAggParams({ type: AGG_PARAMS_ACTION_KEYS.RESET });
          // resent form validity
          setValidity(true);
        }}
        setTouched={() => onChangeAggType({ type: AGG_TYPE_ACTION_KEYS.TOUCHED, payload: true })}
        setValidity={validity =>
          onChangeAggType({ type: AGG_TYPE_ACTION_KEYS.VALIDITY, payload: validity })
        }
      />

      {params.basic.map((param: ParamInstance) => {
        const model = aggParams[param.aggParam.name] || {
          touched: false,
          validity: true,
        };

        return renderParam(param, model);
      })}

      {params.advanced.length ? (
        <>
          <EuiAccordion
            id="advancedAccordion"
            buttonContent={i18n.translate(
              'common.ui.vis.editors.advancedToggle.advancedLinkLabel',
              {
                defaultMessage: 'Advanced',
              }
            )}
            paddingSize="none"
          >
            {params.advanced.map((param: ParamInstance) => {
              const model = aggParams[param.aggParam.name] || {
                touched: false,
                validity: true,
              };
              return renderParam(param, model);
            })}
          </EuiAccordion>
          <EuiSpacer size="m" />
        </>
      ) : null}
    </EuiForm>
  );
}

export { DefaultEditorAggParams };
