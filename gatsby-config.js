const fs = require('fs');
const path = require('path');

const feedsPath = process.env.STM_HOME
  ? path.resolve(process.env.STM_HOME)
  : path.resolve(process.env.HOME, '.stm/feeds');

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Solace Event Feeds`,
    siteUrl: `https://www.feeds.solace.dev`,
    description: `A collection of feeds for Solace PubSub+`,
    author: `@SolaceDevs`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Open Sans\:300,400,600`, // you can also specify font weights and styles
        ],
        display: 'swap',
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Solace Event Feeds`,
        short_name: `SolaceFeeds`,
        start_url: `/`,
        icon: `static/favicon.ico`, // This path is relative to the root of the site.
      },
    },
    ...(fs.existsSync(feedsPath)
      ? [
          {
            resolve: 'gatsby-source-filesystem',
            options: {
              name: `feeds`,
              path: path.resolve(feedsPath),
            },
          },
          {
            resolve: `gatsby-transformer-json`,
            options: {
              typeName: `FeedsJson`,
            },
          },
        ]
      : []),
  ],
};
