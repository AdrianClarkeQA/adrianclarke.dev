const pageMatrix = [
  {
    name: 'home',
    route: '/',
    canonical: 'https://adrianclarke.dev/',
    expectsRobotsNoIndex: false
  },
  {
    name: 'about',
    route: '/pages/about-me.html',
    canonical: 'https://adrianclarke.dev/pages/about-me.html',
    expectsRobotsNoIndex: false
  },
  {
    name: 'cv',
    route: '/pages/cv.html',
    canonical: 'https://adrianclarke.dev/pages/cv.html',
    expectsRobotsNoIndex: true
  },
  {
    name: 'print cv',
    route: '/pages/curriculum-vitae.html',
    canonical: 'https://adrianclarke.dev/pages/curriculum-vitae.html',
    expectsRobotsNoIndex: true
  },
  {
    name: 'calculator',
    route: '/calculator/billions.html',
    canonical: 'https://adrianclarke.dev/calculator/billions.html',
    expectsRobotsNoIndex: true
  },
  {
    name: '404',
    route: '/404.html',
    canonical: '',
    expectsRobotsNoIndex: false
  }
];

const navFooterRoutes = pageMatrix.map((entry) => entry.route);

// Which sidebar nav item should be marked aria-current="page" on each route (null = none)
const currentNavByRoute = {
  '/': 'Home',
  '/pages/about-me.html': 'About me',
  '/pages/cv.html': 'CV',
  '/pages/curriculum-vitae.html': 'CV',
  '/calculator/billions.html': null,
  '/404.html': null
};

const visualRoutes = {
  home: '/',
  about: '/pages/about-me.html',
  cv: '/pages/cv.html',
  printCv: '/pages/curriculum-vitae.html',
  calculator: '/calculator/billions.html'
};

module.exports = {
  pageMatrix,
  navFooterRoutes,
  currentNavByRoute,
  visualRoutes
};
