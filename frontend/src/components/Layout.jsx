import React from 'react';
import classes from './Layout.module.scss';

function Layout({ children }) {
  return (
    <div className={classes.overlay}>
      <main className={classes.container}>{children}</main>
    </div>
  );
}

export default Layout;
