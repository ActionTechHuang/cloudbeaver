/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import type { FormatterProps } from 'react-data-grid';

export const IndexFormatter: React.FC<FormatterProps> = function IndexFormatter({ rowIdx }) {
  return (
    <index-formatter as='div'>
      {rowIdx + 1}
    </index-formatter>
  );
};
