export default (files): any => {
  const array: any = [];

  files.keys().forEach(file => {
    const ext = file.split('.').pop();
    const data = files(file);

    switch (ext) {
      case 'ts': {
        array.push(data.default);
        break;
      }
      case 'graphql':
        array.push(data.loc.source.body);
        break;
      default:
        break;
    }
  });

  return array;
};
