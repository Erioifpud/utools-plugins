const caniuse = require('caniuse-api')

const statusTable = {
  y: '完美支持: ',
  n: '不支持: ',
  a: '不完美支持: ',
  x: '需要前缀: '
}

const getDesc = (o) => {
  if (!o) {
    return ''
  }
  return Object.keys(o).map(key => {
    return statusTable[key] + o[key]
  }).join(' | ')
}

const getSimilarKeywords = (name) => {
  return caniuse.find(name.trim()).map(title => ({
    title,
    type: 'keyword'
  }))
}

const getSupports = (name) => {
  const supports = caniuse.getSupport(name.substr(1).trim())
  return Object.entries(supports).map(([browser, versions]) => {
    return {
      title: browser,
      description: getDesc(versions) || '无'
    }
  })
}

window.exports = {
  "default": {
    mode: "list",
    args: {
      search: async (action, searchWord, callbackSetList) => {
        searchWord = searchWord.toLowerCase()
        if (!searchWord.trim()) {
          return
        }
        // 查询兼容性
        if (searchWord.startsWith('=')) {
          const items = getSupports(searchWord)
          callbackSetList(items)
          return
        }
        // 补全关键字
        const keywords = getSimilarKeywords(searchWord)
        callbackSetList(keywords)
      },
      select: (action, itemData) => {
        const { type, title } = itemData
        if (!type) {
          return
        }
        window.utools.setSubInputValue(`=${title}`)
      },
      placeholder: "特性名称"
    }
  }
}
