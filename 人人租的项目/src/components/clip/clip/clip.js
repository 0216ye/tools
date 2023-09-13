import dragger from './dragger';
import throttle from './throttle';
import defaultOptions from './options';
import toBlob from './to-blob';
// import loader from './loader';
class Clip {
  constructor(options) {
    this.options = { ...options, ...defaultOptions };
  }
}

export {
  dragger,
  throttle,
  defaultOptions,
  // loader,
  Clip,
  toBlob,
}