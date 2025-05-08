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

async function UITopNav(options) {
    options = options ?? {};
    
    // Get theme service
    const themeService = globalThis.services.get('theme');
    
    // Create the top navigation HTML
    let h = '';
    h += `<div class="top-nav">`;
        // Left section
        h += `<div class="top-nav-left">`;
            h += `<div class="top-nav-logo">Puter</div>`;
        h += `</div>`;
        
        // Center section
        h += `<div class="top-nav-center">`;
            // Time
            h += `<div class="top-nav-time" id="topNavTime"></div>`;
        h += `</div>`;
        
        // Right section
        h += `<div class="top-nav-right">`;
            // Theme toggle
            h += `<div class="top-nav-theme-toggle">`;
                h += `<div class="theme-toggle-switch">`;
                    h += `<input type="checkbox" id="themeToggle" ${themeService.state.theme_mode === 'light' ? 'checked' : ''}>`;
                    h += `<label for="themeToggle" class="toggle-track">`;
                        h += `<span class="toggle-icon toggle-icon-dark"><i class="iconoir-half-moon"></i></span>`;
                        h += `<span class="toggle-icon toggle-icon-light"><i class="iconoir-sun-light"></i></span>`;
                    h += `</label>`;
                h += `</div>`;
            h += `</div>`;
            
            // Background toggle
            h += `<div class="top-nav-bg-toggle">`;
                h += `<button id="bgToggleBtn" class="bg-toggle-btn" title="Toggle Background">`;
                    h += `<i class="iconoir-${themeService.state.show_background ? 'image' : 'no-image'}"></i>`;
                h += `</button>`;
            h += `</div>`;
            
            // User menu
            h += `<div class="top-nav-user">`;
                h += `<button class="user-menu-btn">`;
                    h += `<i class="iconoir-user"></i>`;
                h += `</button>`;
            h += `</div>`;
        h += `</div>`;
    h += `</div>`;
    
    // Append the top nav to the desktop
    $('.desktop').prepend(h);
    
    // Update time
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        $('#topNavTime').text(`${hours}:${minutes}`);
    }
    
    // Update time initially and then every minute
    updateTime();
    setInterval(updateTime, 60000);
    
    // Theme toggle event handler
    $('#themeToggle').on('change', function() {
        const isLight = $(this).is(':checked');
        themeService.toggleTheme(isLight);
    });
    
    // Background toggle event handler
    $('#bgToggleBtn').on('click', function() {
        const newState = !themeService.state.show_background;
        themeService.toggleBackground(newState);
        $(this).find('i').attr('class', `iconoir-${newState ? 'image' : 'no-image'}`);
    });
    
    // Listen for theme changes
    $(document).on('themeToggled', function(e, data) {
        $('#themeToggle').prop('checked', data.isLight);
    });
    
    // Listen for background changes
    $(document).on('backgroundToggled', function(e, data) {
        $('#bgToggleBtn').find('i').attr('class', `iconoir-${data.showBackground ? 'image' : 'no-image'}`);
    });
}

export default UITopNav;