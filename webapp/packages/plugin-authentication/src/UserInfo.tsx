/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import styled, { css } from 'reshadow';

import { topMenuStyles } from '@cloudbeaver/core-app';
import { AuthInfoService } from '@cloudbeaver/core-authentication';
import { IconOrImage } from '@cloudbeaver/core-blocks';
import { useService } from '@cloudbeaver/core-di';
import { MenuTrigger } from '@cloudbeaver/core-dialogs';
import { useStyles } from '@cloudbeaver/core-theming';

import { UserMenuService } from './UserMenu/UserMenuService';
import { userMenuStyles } from './UserMenu/userMenuStyles';

const styles = css`
  user {
    height: 100%;
    padding: 0 16px;
    display: flex;
    align-items: center;
  }
  IconOrImage {
    display: block;
    width: 24px;
  }
  user-name {
    display: block;
    line-height: initial;
    margin-left: 8px;
  }
`;

export const UserInfo = observer(function UserInfo() {
  const userMenuService = useService(UserMenuService);
  const authInfoService = useService(AuthInfoService);
  const style = useStyles(styles, userMenuStyles);

  if (!authInfoService.userInfo) {
    return null;
  }

  return styled(style)(
    <MenuTrigger panel={userMenuService.getMenu()} style={[topMenuStyles]}>
      <user>
        <user-icon>
          <IconOrImage icon='user' viewBox='0 0 28 28' />
        </user-icon>
        <user-name>{authInfoService.userInfo.displayName || authInfoService.userInfo.userId}</user-name>
      </user>
    </MenuTrigger>
  );
});
