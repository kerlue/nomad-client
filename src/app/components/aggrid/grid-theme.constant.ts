import {
  themeBalham,
  themeQuartz,
} from 'ag-grid-community';

export const GLOBAL_GRID_THEME = themeQuartz.withParams({
  wrapperBorder: true,
  selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
  headerHeight: '38px',
  rowHeight: '35px',
});
