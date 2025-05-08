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
 * Icon Replacer Utility
 * This file provides utilities for replacing existing icons with Iconoir icons
 */

// Map of common icon names to their Iconoir equivalents
const iconMap = {
  // System icons
  'start.svg': 'home',
  'close.svg': 'cancel',
  'magnifier-outline.svg': 'search',
  'palette-outline.svg': 'color-picker',
  'folders.svg': 'folder',
  'trash.svg': 'trash',
  'trash-full.svg': 'trash',
  'app.svg': 'apps',
  
  // Theme icons
  'moon.svg': 'half-moon',
  'sun.svg': 'sun-light',
  
  // File icons
  'file.svg': 'file',
  'image.svg': 'image',
  'document.svg': 'doc',
  'code.svg': 'code',
  'music.svg': 'music-note',
  'video.svg': 'play',
  
  // Action icons
  'plus.svg': 'plus',
  'minus.svg': 'minus',
  'edit.svg': 'edit-pencil',
  'delete.svg': 'bin',
  'download.svg': 'download',
  'upload.svg': 'upload',
  'share.svg': 'share-ios',
  'settings.svg': 'settings',
  'info.svg': 'info-empty',
  'warning.svg': 'warning-triangle',
  'error.svg': 'warning-circle',
  'success.svg': 'check-circle',
  
  // Add more mappings as needed
};

/**
 * Get Iconoir HTML for an icon
 * @param {string} name - The name of the icon
 * @param {object} options - Options for the icon
 * @returns {string} - The HTML for the icon
 */
function getIconoirHtml(name, options = {}) {
  const { size = 24, className = '' } = options;
  const iconName = iconMap[name] || name.replace('.svg', '');
  return `<i class="iconoir-${iconName} ${className}" style="font-size: ${size}px;"></i>`;
}

/**
 * Replace an image element with an Iconoir icon
 * @param {HTMLElement} imgElement - The image element to replace
 */
function replaceImageWithIconoir(imgElement) {
  const src = imgElement.getAttribute('src');
  if (!src) return;
  
  // Extract the icon name from the src
  const iconName = src.split('/').pop();
  if (!iconMap[iconName]) return;
  
  // Create the Iconoir icon
  const iconHtml = getIconoirHtml(iconName, {
    size: imgElement.width || 24,
    className: imgElement.className
  });
  
  // Replace the image with the icon
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = iconHtml;
  const iconElement = tempDiv.firstChild;
  
  // Copy relevant attributes
  if (imgElement.id) iconElement.id = imgElement.id;
  if (imgElement.title) iconElement.title = imgElement.title;
  if (imgElement.alt) iconElement.setAttribute('aria-label', imgElement.alt);
  
  // Replace the image
  imgElement.parentNode.replaceChild(iconElement, imgElement);
}

/**
 * Replace all icons in the document with Iconoir icons
 */
export function replaceAllIcons() {
  // Replace icons in window.icons object
  if (window.icons) {
    for (const [key, value] of Object.entries(iconMap)) {
      if (window.icons[key]) {
        // Store the original icon URL
        const originalUrl = window.icons[key];
        
        // Replace with Iconoir
        window.icons[key] = `iconoir:${value}`;
        
        // Add a method to get the HTML
        window.getIconHtml = function(iconKey, options = {}) {
          const icon = window.icons[iconKey];
          if (icon && icon.startsWith('iconoir:')) {
            return getIconoirHtml(icon.replace('iconoir:', ''), options);
          }
          return `<img src="${icon}" alt="${iconKey}" />`;
        };
      }
    }
  }
  
  // Replace existing image elements
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      const iconName = src.split('/').pop();
      if (iconMap[iconName]) {
        replaceImageWithIconoir(img);
      }
    }
  });
}

/**
 * Initialize the icon replacer
 */
export function initIconReplacer() {
  // Replace all icons immediately
  replaceAllIcons();
  
  // Set up a MutationObserver to replace icons in new elements
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node is an image
            if (node.tagName === 'IMG') {
              const src = node.getAttribute('src');
              if (src) {
                const iconName = src.split('/').pop();
                if (iconMap[iconName]) {
                  replaceImageWithIconoir(node);
                }
              }
            }
            
            // Check for images within the added node
            node.querySelectorAll('img').forEach(img => {
              const src = img.getAttribute('src');
              if (src) {
                const iconName = src.split('/').pop();
                if (iconMap[iconName]) {
                  replaceImageWithIconoir(img);
                }
              }
            });
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return {
    replaceAllIcons,
    getIconoirHtml
  };
}

export default {
  initIconReplacer,
  replaceAllIcons,
  getIconoirHtml
};