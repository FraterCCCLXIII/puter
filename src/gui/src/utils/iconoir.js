/**
 * Copyright (C) 2024-present Puter Technologies Inc.
 *
 * This file is part of Puter.
 *
 * Puter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Iconoir icon utility functions
 * This file provides utilities for working with Iconoir icons (https://iconoir.com/)
 */

// Map of common icon names to their Iconoir equivalents
const iconMap = {
  // System icons
  'start.svg': 'https://api.iconify.design/iconoir/home.svg',
  'close.svg': 'https://api.iconify.design/iconoir/cancel.svg',
  'magnifier-outline.svg': 'https://api.iconify.design/iconoir/search.svg',
  'palette-outline.svg': 'https://api.iconify.design/iconoir/color-picker.svg',
  
  // Theme icons
  'moon.svg': 'https://api.iconify.design/iconoir/half-moon.svg',
  'sun.svg': 'https://api.iconify.design/iconoir/sun-light.svg',
  
  // Add more mappings as needed
};

/**
 * Initialize Iconoir icons by loading the CSS and replacing existing icons
 */
export async function initIconoir() {
  // Add Iconoir CSS to the document
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/iconoir@6.11.0/css/iconoir.min.css';
  document.head.appendChild(link);
  
  // Replace existing icons with Iconoir equivalents
  replaceExistingIcons();
  
  // Return a promise that resolves when the CSS is loaded
  return new Promise((resolve) => {
    link.onload = () => resolve();
  });
}

/**
 * Replace existing icons with Iconoir equivalents
 */
function replaceExistingIcons() {
  // Replace icons in window.icons object
  if (window.icons) {
    for (const [key, value] of Object.entries(iconMap)) {
      if (window.icons[key]) {
        window.icons[key] = value;
      }
    }
  }
}

/**
 * Get an Iconoir icon URL
 * @param {string} name - The name of the icon
 * @returns {string} - The URL of the Iconoir icon
 */
export function getIconoirUrl(name) {
  return iconMap[name] || `https://api.iconify.design/iconoir/${name}.svg`;
}

/**
 * Create an Iconoir icon element
 * @param {string} name - The name of the icon
 * @param {object} options - Options for the icon
 * @returns {HTMLElement} - The icon element
 */
export function createIconoirIcon(name, options = {}) {
  const { size = 24, color = 'currentColor', className = '' } = options;
  
  const icon = document.createElement('i');
  icon.className = `iconoir-${name} ${className}`;
  icon.style.fontSize = `${size}px`;
  icon.style.color = color;
  
  return icon;
}

/**
 * Get an Iconoir icon as an SVG string
 * @param {string} name - The name of the icon
 * @returns {Promise<string>} - A promise that resolves to the SVG string
 */
export async function getIconoirSvg(name) {
  const url = getIconoirUrl(name);
  const response = await fetch(url);
  return await response.text();
}

export default {
  initIconoir,
  getIconoirUrl,
  createIconoirIcon,
  getIconoirSvg,
};