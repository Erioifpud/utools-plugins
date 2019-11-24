const rp = require('request-promise-native')
const debounce = require('debounce-promise')

const searchByName = debounce((name) => {
  return rp({
    url: 'https://api.npms.io/v2/search',
    qs: {
      q: name,
      size: 20
    },
    json: true
  }).then(resp => resp.results)
}, 800)

window.exports = {
  "default": {
    mode: "list",
    args: {
      search: async (action, searchWord, callbackSetList) => {
        if (!searchWord.trim()) {
          return
        }
        const result = []
        callbackSetList([
          {
            title: `${searchWord}`,
            description: "搜索中...",
            icon: "icon.png"
          }
        ])
        await searchByName(searchWord.trim()).then(list => {
          list.forEach(item => {
            const { package } = item
            result.push({
              title: package.name,
              description: package.description,
              url: package.links.npm,
              icon: "icon.png"
            })
          })
        })
        callbackSetList(result)
      },
      select: (action, itemData) => {
        const url = itemData.url
        if (!url) {
          return
        }
        window.utools.hideMainWindow()
        require("electron").shell.openExternal(url)
        window.utools.outPlugin()
      },
      placeholder: "npm 模块名"
    }
  }
}
