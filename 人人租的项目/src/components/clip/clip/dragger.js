const dragger = (params) => {
  const target = params.target;
  const startcb = typeof params.startcb === 'function' ? params.startcb : () => null;
  const movecb = typeof params.movecb === 'function' ? params.movecb : () => null;
  const donecb = typeof params.donecb === 'function' ? params.donecb : () => null;
  let pageX = 0;
  let pageY = 0;

  function move(e) {
    e.stopPropagation();
    const event = (e.type === 'touchmove') ? e.touches[0] : e;
    // 往 左 上 为 负
    // 往 右 下 为 正
    // 每次计算，都是用当前的值减去初始的值，所以不会不跟手
    movecb({
      moveLeft: event.pageX - pageX,
      moveTop: event.pageY - pageY,
    })
  }

  function done(e) {
    const event = (e.type === 'touchend') ? e.touches[0] : e;
    movecb({
      moveLeft: event.pageX - pageX,
      moveTop: event.pageY - pageY,
    })

    window.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', done);
    window.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', done);

    donecb();
  }

  function start(e) {
    e.stopPropagation();
    e.preventDefault();

    const event = (e.type === 'touchstart') ? e.touches[0] : e;

    pageX = event.pageX;
    pageY = event.pageY;

    if (!startcb(pageX, pageY, event)) return;

    if (e.type === 'mousedown') {
      window.addEventListener('mousemove', move);
      document.addEventListener('mouseup', done);
    } else if (e.type === 'touchstart') {
      window.addEventListener('touchmove', move);
      document.addEventListener('touchend', done);
    }
  }

  function remove() {
    target.removeEventListener('mousedown', start);
    target.removeEventListener('touchstart', start);
  }

  target.addEventListener('mousedown', start);
  target.addEventListener('touchstart', start);

  return { remove };
}

export default dragger;