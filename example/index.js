(async () => {
  console.time('example');
  await require('./../src').default();
  console.timeEnd('example');
})();
