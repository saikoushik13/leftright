// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { Router } from './posts/Router.js';

Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post


// Add a post type definition
Devvit.addCustomPostType({
  name: 'Emojit',
  height: 'tall',
  render:Router,
});

export default Devvit;
