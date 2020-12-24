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

import './index.scss';
import 'brace/mode/json';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { EventEmitter } from 'events';
import { EuiResizableContainer } from '@elastic/eui';

import { EditorRenderProps } from 'src/plugins/visualize/public';
import { Vis, VisualizeEmbeddableContract } from 'src/plugins/visualizations/public';
import { KibanaContextProvider } from '../../kibana_react/public';
import { Storage } from '../../kibana_utils/public';

import { DefaultEditorSideBar } from './components/sidebar';
import { getInitialWidth } from './editor_size';

const localStorage = new Storage(window.localStorage);

function DefaultEditor({
  core,
  data,
  vis,
  uiState,
  timeRange,
  filters,
  query,
  embeddableHandler,
  eventEmitter,
  linked,
  savedSearch,
}: EditorRenderProps & {
  vis: Vis;
  eventEmitter: EventEmitter;
  embeddableHandler: VisualizeEmbeddableContract;
}) {
  const visRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onClickCollapse = useCallback(() => {
    setIsCollapsed((value) => !value);
  }, []);

  /**
   * The empty callback is in place to prevent resetting the dragging state of the resize button.
   * The mouseLeave is triggered since a visualization is rendered through another call of "ReactDOM.render()"" in expressions,
   * using the "visRef" node reference.
   * Here is the existing React issue: https://github.com/facebook/react/issues/17064
   */
  const onEditorMouseLeave = useCallback(() => {}, []);

  useEffect(() => {
    if (!visRef.current) {
      return;
    }

    embeddableHandler.render(visRef.current);
    setTimeout(() => {
      eventEmitter.emit('embeddableRendered');
    });

    return () => embeddableHandler.destroy();
  }, [embeddableHandler, eventEmitter]);

  useEffect(() => {
    embeddableHandler.updateInput({
      timeRange,
      filters,
      query,
    });
  }, [embeddableHandler, timeRange, filters, query]);

  const editorInitialWidth = getInitialWidth(vis.type.editorConfig.defaultSize);

  return (
    <core.i18n.Context>
      <KibanaContextProvider
        services={{
          appName: 'vis_default_editor',
          storage: localStorage,
          data,
          ...core,
        }}
      >
        <EuiResizableContainer className="visEditor--default" onMouseLeave={onEditorMouseLeave}>
          {(EuiResizablePanel, EuiResizableButton) => (
            <>
              <EuiResizablePanel
                className="visEditor__visualization"
                initialSize={100 - editorInitialWidth}
              >
                <div className="visEditor__canvas" ref={visRef} data-shared-items-container />
              </EuiResizablePanel>

              <EuiResizableButton
                className={`visEditor__resizer ${isCollapsed ? 'visEditor__resizer-isHidden' : ''}`}
              />

              <EuiResizablePanel
                className={`visEditor__collapsibleSidebar ${
                  isCollapsed ? 'visEditor__collapsibleSidebar-isClosed' : ''
                }`}
                initialSize={editorInitialWidth}
                minSize={isCollapsed ? '0' : '350px'}
              >
                <DefaultEditorSideBar
                  embeddableHandler={embeddableHandler}
                  isCollapsed={isCollapsed}
                  onClickCollapse={onClickCollapse}
                  vis={vis}
                  uiState={uiState}
                  isLinkedSearch={linked}
                  savedSearch={savedSearch}
                  timeRange={timeRange}
                  eventEmitter={eventEmitter}
                />
              </EuiResizablePanel>
            </>
          )}
        </EuiResizableContainer>
      </KibanaContextProvider>
    </core.i18n.Context>
  );
}

// default export required for React.Lazy
// eslint-disable-next-line import/no-default-export
export { DefaultEditor as default };
