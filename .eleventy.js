module.exports = function(eleventyConfig) {
    // Output directory: _site
  
    // Copy `assets/` to `_site/`
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");

    eleventyConfig.addFilter("isoDate", date => {
        return date.toISOString().substring(0, 10)
    })

    // FOOTNOTES

    let footnotes = []

    eleventyConfig.addShortcode("fn", text => {
        footnotes.push(text)
        id = footnotes.length
        return `<sup id="ref-${id}"><a href="#footnote-${id}" class="fn">[${id}]</a></sup>`
    })

    eleventyConfig.addShortcode("footnotes", (h) => {
        if (footnotes.length === 0) return ""

        if (!h) h = `h3`

        let footnoteHtml = `<section id="footnotes"><${h}>footnotes</${h}><ol>`

        for (let i = 0; i < footnotes.length; i++) {
            const text = footnotes[i]
            const id = i + 1
            footnoteHtml += `<li id="footnote-${id}"><a href="#ref-${id}" title="Jump up">^</a> ${text}</li>`
        }

        footnotes = []
        return footnoteHtml + `</ol></section>`
    })

    eleventyConfig.addShortcode("breadcrumb", url => {
        let parts = url.split('/').filter(s => s.trim().length > 0)
        
        if (parts.length === 0) return `<a href="/" aria-current="page">home</a>`

        let here = `<a href="/">home</a>`
        let path = "/"
        const last = parts[parts.length - 1]
        for (let part of parts) {
            path += `${part}/`

            let current = part === last ? `aria-current="page"` : ``

            here += ` > <a href="${path}" ${current}>${part}</a>`
        }
        return here
    })

    eleventyConfig.addShortcode("generateSitemap", pages => {
        const sorted = require('sort-paths')(pages, p => p.url, '/')

        let tree = sorted.reduce((currentResults, currentPage) => {
            const pathParts = currentPage.url.split('/').filter(s => s.trim().length > 0)
            
            pathParts.reduce((nodes, name) => {
                let node = nodes.find(node => node.name === name)
        
                if (!node) {
                    node = {
                        name,
                        url: currentPage.url,
                        data: currentPage.data,
                        children: []
                    }
                    nodes.push(node)
                }
        
                return node.children
            }, currentResults)
        
            return currentResults
        }, [])

        const createList = (pageTree, displayHome = false) => {
            let list = `<ul>`

            displayHome && (list += `<li><a href="/">home</a></li>`)

            for (let page of pageTree) {
                if (page.data.excludeFromSitemap === true) continue

                let item = `<li>`

                item += `<a href="${page.url}">${page.data.title || page.name}</a>`

                if (page.children.length > 0 && page.data.excludeChildrenFromSitemap !== true) {
                    item += createList(page.children)
                }

                item += `</li>`
                list += item
            }

            list += `</ul>`

            return list
        }

        return createList(tree, true)
    })

    return {
        dir: {
            input: "src",
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    }
  };
