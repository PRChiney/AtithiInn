import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const Meta = ({
  title = 'Welcome to Atithi',
  description = 'Find the best hotels for your next trip',
  keywords = 'hotels, book hotels, travel, vacation',
  author = 'Atithi Team',
  image = ''
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:keywords" content={keywords} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  author: PropTypes.string,
  image: PropTypes.string,
};

export default Meta;