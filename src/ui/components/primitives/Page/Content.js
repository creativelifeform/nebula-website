import { node, string } from 'prop-types';

import React from 'react';

export const Content = ({
  children,
  title = null,
  description = null,
  className = '',
}) => (
  <section className={`Content ${className}`}>
    {title && (
      <header>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </header>
    )}
    <section className="main">{children}</section>
  </section>
);

Content.propTypes = {
  children: node,
  title: string,
  description: string,
  className: string,
};
