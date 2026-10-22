module.exports = {
  siteMetadata: {
    siteTitle: `Paresh Subedi`,
    siteTitleAlt: `Paresh Subedi — Data Scientist`,
    siteUrl: `https://pareshsubedi.com.np`,
    siteDescription: `Paresh Subedi is a Data Science M.S. candidate at Fordham University researching efficient Transformer models, and building applied ML, data engineering and analytics systems.`,
    siteLanguage: `en`,
    author: `Paresh Subedi`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [require(`tailwindcss`), require(`autoprefixer`)],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Paresh Subedi`,
        short_name: `Paresh`,
        description: `Data science portfolio of Paresh Subedi`,
        start_url: `/`,
        background_color: `#05060a`,
        theme_color: `#05060a`,
        display: `standalone`,
        icons: [
          { src: `/android-chrome-192x192.png`, sizes: `192x192`, type: `image/png` },
          { src: `/android-chrome-512x512.png`, sizes: `512x512`, type: `image/png` },
        ],
      },
    },
    `gatsby-plugin-gatsby-cloud`,
  ],
}
