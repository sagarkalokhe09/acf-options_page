const { createWriteStream } = require('fs')
const { SitemapStream } = require('sitemap')

// Creates a sitemap object given the input configuration with URLs
const sitemap = new SitemapStream({ hostname: process.argv.slice(2)[0] || 'https://stable.getautoclicker.com/' })
const writeStream = createWriteStream('./public/sitemap.xml')
sitemap.pipe(writeStream)
sitemap.write('/')
sitemap.end()
