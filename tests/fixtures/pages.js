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

const navFooterRoutes = [
  '/',
  '/pages/about-me.html',
  '/pages/cv.html',
  '/calculator/billions.html',
  '/404.html'
];

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
  visualRoutes
};
