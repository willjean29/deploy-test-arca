export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error('Solo permitidas las imagenes'), false);
  }
  callback(null, true);
};

export const fileFilter = (req, file, callback) => {
  if (
    !file.originalname.match(
      /\.(docx|doc|pdf|txt|ppt|pptx|xls|xlsx|rar|zip|jpg|jpeg|png|mp3|mp4|wav|mov|avi)$/, 
    )
  ) {
    return callback(new Error('Archivo inválido'), false);
  }
  callback(null, true);
};

export const normalize = (function() {
  let from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
    to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
    mapping = {};

  for (let i = 0, j = from.length; i < j; i++)
    mapping[from.charAt(i)] = to.charAt(i);

  return function(str) {
    let ret = [];
    for (let i = 0, j = str.length; i < j; i++) {
      let c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
      else ret.push(c);
    }
    return ret.join('');
  };
})();
