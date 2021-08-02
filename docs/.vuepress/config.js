module.exports = {
  title: 'TheWall Docs',
  base: '/',
  themeConfig: {
    nav: [
      { text: 'How it Works', link: '/how-it-works/' },
      { text: 'Getting Started', link: '/gettingstarted/' },
      { text: 'Collaborate!', link: '/collaborate/'}
    ],
    displayAllHeaders: true,
    sidebar: {
      '/how-it-works/': [{
        title: 'Overview: How it Works',  
        path: '/how-it-works/',
        children: []
      }, {
        title: 'TheWall Instance',  
        path: '/how-it-works/the-wall',
        children: []
      }, {
        title: 'TheWall File',  
        path: '/how-it-works/the-file',
        children: []
      }]
    },
  },
}
