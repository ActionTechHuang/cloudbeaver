/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2022 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import styled, { css } from 'reshadow';

import { PermissionsResource } from '@cloudbeaver/core-administration';
import { BASE_CONTAINERS_STYLES, ColoredContainer, FieldCheckbox, Group, GroupTitle, InputField, SubmittingForm, Textarea, useMapResource, useTranslate, useStyles } from '@cloudbeaver/core-blocks';
import { CachedMapAllKey } from '@cloudbeaver/core-sdk';
import type { TabContainerPanelComponent } from '@cloudbeaver/core-ui';

import type { ITeamFormProps } from '../ITeamFormProps';

const styles = css`
  SubmittingForm {
    flex: 1;
    overflow: auto;
  }
  caption {
    composes: theme-text-text-hint-on-light theme-typography--caption from global;
  }
`;

export const TeamOptions: TabContainerPanelComponent<ITeamFormProps> = observer(function TeamOptions({
  state,
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const translate = useTranslate();
  const permissionsResource = useMapResource(TeamOptions, PermissionsResource, CachedMapAllKey);
  const style = useStyles(BASE_CONTAINERS_STYLES, styles);
  const edit = state.mode === 'edit';

  return styled(style)(
    <SubmittingForm ref={formRef}>
      <ColoredContainer parent gap overflow>
        <Group small gap>
          <InputField
            name='teamId'
            state={state.config}
            readOnly={state.readonly || edit}
            disabled={state.disabled}
            required
            tiny
            fill
          >
            {translate('administration_teams_team_id')}
          </InputField>
          <InputField
            name='teamName'
            state={state.config}
            readOnly={state.readonly}
            disabled={state.disabled}
            tiny
            fill
          >
            {translate('administration_teams_team_name')}
          </InputField>
          <Textarea
            name='description'
            state={state.config}
            readOnly={state.readonly}
            disabled={state.disabled}
            tiny
            fill
          >
            {translate('administration_teams_team_description')}
          </Textarea>
        </Group>
        <Group small gap>
          <GroupTitle>{translate('administration_teams_team_permissions')}</GroupTitle>
          {permissionsResource.resource.values.map(permission => {
            const label = permission.label ?? permission.id;

            let caption = '';

            if (permission.description) {
              caption = permission.description;
            } else if (permission.label) {
              caption = `(${permission.id})`;
            }

            let tooltip = `${permission.id}`;

            if (permission.label) {
              tooltip = permission.label + ` (${permission.id})`;
            }

            return (
              <FieldCheckbox
                key={permission.id}
                id={permission.id}
                value={permission.id}
                title={tooltip}
                name='teamPermissions'
                state={state.config}
                readOnly={state.readonly}
                disabled={state.disabled}
              >
                {label}
                {caption ? <caption>{caption}</caption> : null}
              </FieldCheckbox>
            );
          })}
        </Group>
      </ColoredContainer>
    </SubmittingForm>
  );
});
