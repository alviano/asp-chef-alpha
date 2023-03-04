import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const privacy_policy = writable(browser ? localStorage.getItem('privacy-policy') : '');
export const recipe = writable([]);
export const input_rows = writable(browser ? Number.parseInt(localStorage.getItem('input-rows')) || 10 : 10);
export const output_rows = writable(browser ? Number.parseInt(localStorage.getItem('output-rows')) || 10 : 10);
export const show_ingredient_details = writable(true);

privacy_policy.subscribe(value => {
  if (value) {
    localStorage.setItem('privacy-policy', value);
  }
});

input_rows.subscribe(value => {
  localStorage.setItem('input-rows', '' + value);
});

output_rows.subscribe(value => {
  localStorage.setItem('output-rows', '' + value);
});