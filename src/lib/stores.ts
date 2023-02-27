import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const privacy_policy = writable(browser ? localStorage.getItem('privacy-policy') : '');
export const recipe = writable([]);

privacy_policy.subscribe(value => {
  if (value) {
    localStorage.setItem('privacy-policy', value);
  }
});
