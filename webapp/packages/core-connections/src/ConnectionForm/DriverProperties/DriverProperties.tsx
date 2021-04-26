/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { computed, observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import styled, { css } from 'reshadow';

import { IProperty, Loader, PropertiesTable, TabContainerPanelComponent, useMapResource, useTab } from '@cloudbeaver/core-blocks';
import { useStyles } from '@cloudbeaver/core-theming';
import { uuid } from '@cloudbeaver/core-utils';

import { DBDriverResource } from '../../DBDriverResource';
import type { IConnectionFormProps } from '../IConnectionFormProps';

const styles = css`
  properties {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: auto;
  }
  center {
    margin: auto;
  }
`;

export const DriverProperties: TabContainerPanelComponent<IConnectionFormProps> = observer(function DriverProperties({
  tabId,
  state: formState,
}) {
  const style = useStyles(styles);
  const { selected } = useTab(tabId);

  const [state] = useState(() => {
    const propertiesList: IProperty[] = observable([]);

    function add(key?: string, value?: string) {
      propertiesList.unshift({
        id: uuid(),
        key: key ?? '',
        defaultValue: value ?? '',
        keyPlaceholder: 'property',
        new: !key,
      });
    }

    function remove(property: IProperty) {
      propertiesList.splice(propertiesList.indexOf(property), 1);
    }

    return { propertiesList, add, remove };
  });

  const driver = useMapResource(
    DBDriverResource,
    { key: (selected && formState.config.driverId) || null, includes: ['includeDriverProperties'] },
    {
      onData: driver => {
        for (const key of Object.keys(formState.config.properties)) {
          if (driver.driverProperties?.some(property => property.id === key)
           || state.propertiesList.some(property => property.key === key)) {
            continue;
          }

          state.add(key, formState.config.properties[key]);
        }
      },
    }
  );

  const joinedProperties = useMemo(() => computed<IProperty[]>(() => ([
    ...state.propertiesList,
    ...(driver.data?.driverProperties
      ? driver.data.driverProperties.map<IProperty>(property => ({
        id: property.id!,
        key: property.id!,
        keyPlaceholder: property.id,
        displayName: property.displayName,
        valuePlaceholder: property.defaultValue,
        defaultValue: property.defaultValue,
        description: property.description,
        validValues: property.validValues,
      }))
      : []),
  ])), [driver.data]);

  return styled(style)(
    <properties as="div">
      <Loader state={driver}>
        {() => (
          <PropertiesTable
            properties={joinedProperties.get()}
            propertiesState={formState.config.properties}
            readOnly={formState.readonly}
            onAdd={state.add}
            onRemove={state.remove}
          />
        )}
      </Loader>
    </properties>
  );
});
