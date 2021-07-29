module.exports = {
  title: 'TheWall Docs',
  base: '/',
  themeConfig: {
    nav: [
      { text: 'How it Works', link: '/how-it-works/' },
      { text: 'Getting Started', link: '/gettingstarted/' },
      { text: 'TheWall File', link: '/thewallfile/' },
      { text: 'Collaborate!', link: '/collaborate/'}
    ],
    displayAllHeaders: true,
    sidebar: {
      '/gettingstarted/': [{
        title: 'Getting Started',   // required
        depth: 2,
        path: '/gettingstarted/ejs',
        children: []
      }, {
        title: 'Getting Started: Chinchay + Angular',   // required
        path: '/gettingstarted/angular',
        children: []
      }, {
        title: 'Getting Started: RESTful API',   // required
        path: '/gettingstarted/apiMiddleware',
        children: []
      }],
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
