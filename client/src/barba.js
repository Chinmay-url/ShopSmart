import barba from '@barba/core';

const initBarba = () => {
  barba.init({
    prevent: ({ el }) => el.classList && el.classList.contains('no-barba'),
    rules: [{
      from: {
        namespace: ['home', 'results', 'about', 'contact', 'profile', 'login', 'signup']
      },
      to: {
        namespace: ['home', 'results', 'about', 'contact', 'profile', 'login', 'signup']
      },
      // Ignore search links to force a reload
      prevent: ({ href }) => /results\?query=/.test(href),
    }],
    transitions: [{
      name: 'opacity-transition',
      leave(data) {
        return new Promise(resolve => {
          data.current.container.style.opacity = 0;
          setTimeout(resolve, 300);
        });
      },
      enter(data) {
        return new Promise(resolve => {
          data.next.container.style.opacity = 0;
          // A short delay to ensure the new content is in the DOM
          setTimeout(() => {
            data.next.container.style.transition = 'opacity 0.3s ease';
            data.next.container.style.opacity = 1;
            resolve();
          }, 50);
        });
      }
    }]
  });
};

export default initBarba;
