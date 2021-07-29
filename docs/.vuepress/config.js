module.exports = {
  title: 'Chinchay Docs',
  base: '/',
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/gettingstarted/' },
      { text: 'Docs', link: '/docs/' },
      { text: 'The Model', link: '/models/' },
      { text: 'Middleware', link: '/middleware/' },
      { text: 'Error Handler', link: '/errorhandler/'},
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
      '/docs/': [{
        title: 'Overview: What is Chinchay?',   // required
        path: '/docs/overview',
        children: []
      }, {
        title: 'Command Line Interface',   // required
        path: '/docs/cli',
        children: []
      }, {
        title: 'Chainfile',   // required
        path: '/docs/chainfile',
        children: []
      }, {
        title: 'Hateoas Generator',   // required
        path: '/docs/hateoas',
        children: []
      }, {
        title: 'The TableGateway Model',   // required
        path: '/docs/model',
        children: []
      }, {
        title: 'Chinchay Middleware',   // required
        path: '/docs/middleware',
        children: []
      }, {
        title: 'Error Handler: Manage http responses',   // required
        path: '/docs/errorhandler',
        children: []
      }, {
        title: 'API: Client Querying',   // required
        path: '/docs/clientside',
        children: []
      }],
      '/models/': [{
        title: 'New',   // required
        path: '/models/newsave',
        children: []
      }, {
        title: 'Find',   // required
        path: '/models/find',
        children: []
      }, {
        title: 'Count',   // required
        path: '/models/count',
        children: []
      }, {
        title: 'Update',   // required
        path: '/models/update',
        children: []
      }, {
        title: 'Delete',   // required
        path: '/models/delete',
        children: []
      }, {
        title: 'Sum, Min & Max',   // required
        path: '/models/aggregation',
        children: []
      }, {
        title: 'Miscellaneous',   // required
        path: '/models/miscellaneous',
        children: []
      }, {
        title: 'Creating your own methods',   // required
        path: '/models/customMethods',
        children: []
      }],
      '/middleware/': [{
        title: 'Access',   // required
        path: '/middleware/access',
        children: []
      }, {
        title: 'Middleware',   // required
        path: '/middleware/middleware',
        children: []
      }, {
        title: 'httpResponse',   // required
        path: '/middleware/http-response',
        children: []
      }], 
      '/errorhandler/': [{
        title: 'ChinchayError',   // required
        path: '/errorhandler/chinchay-error',
        children: []
      }, {
        title: 'ErrorHandler',   // required
        path: '/errorhandler/error-handler',
        children: []
      }, {
        title: 'GoodPractices',   // required
        path: '/errorhandler/good-practices',
        children: []
      }] 
    },
  },
}
