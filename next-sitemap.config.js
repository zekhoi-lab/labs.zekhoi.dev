/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://labs.zekhoi.dev',
  generateRobotsTxt: true,
  // optional
  // robotsTxtOptions: {
  //   additionalSitemaps: [
  //     'https://labs.zekhoi.dev/server-sitemap.xml', // <==== Add here
  //   ],
  // },
}
