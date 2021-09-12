var blessed = require('blessed');

var screen = blessed.screen({
	smartCSR: true
});

screen.title = 'test window';

var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'grey'
    }
  }
});

screen.append(box);

screen.key(['escape', 'q'], (ch, key) => {
    return process.exit(0);
});

box.focus();

screen.render();
