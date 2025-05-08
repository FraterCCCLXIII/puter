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

import launch_app from "../helpers/launch_app.js"

async function UIDock(options) {
    options = options ?? {};
    
    // Create the dock HTML
    let h = '';
    h += `<div class="dock">`;
        // Home icon
        h += `<div class="dock-icon active">`;
            h += `<i class="iconoir-home"></i>`;
        h += `</div>`;
        
        // Browser icon
        h += `<div class="dock-icon" id="browserIcon">`;
            h += `<i class="iconoir-browser"></i>`;
        h += `</div>`;
        
        // Explorer/Files icon
        h += `<div class="dock-icon" id="explorerIcon">`;
            h += `<i class="iconoir-folder"></i>`;
        h += `</div>`;
        
        // Mail icon
        h += `<div class="dock-icon" id="mailIcon">`;
            h += `<i class="iconoir-mail"></i>`;
            h += `<span class="notification-badge">3</span>`;
        h += `</div>`;
        
        // Terminal icon
        h += `<div class="dock-icon" id="terminalIcon">`;
            h += `<i class="iconoir-terminal"></i>`;
        h += `</div>`;
        
        // Contacts icon
        h += `<div class="dock-icon" id="contactsIcon">`;
            h += `<i class="iconoir-user"></i>`;
        h += `</div>`;
        
        // App Store icon
        h += `<div class="dock-icon" id="appStoreIcon">`;
            h += `<i class="iconoir-app-store"></i>`;
        h += `</div>`;
        
        // Trash icon
        h += `<div class="dock-icon" id="trashIcon">`;
            h += `<i class="iconoir-trash"></i>`;
        h += `</div>`;
    h += `</div>`;
    
    // Append the dock to the desktop
    $('.desktop').append(h);
    
    // Add click handlers for dock icons
    
    // Explorer/Files icon click handler
    $('#explorerIcon').on('click', function() {
        launch_app({ name: 'explorer', path: window.home_path});
    });
    
    // Terminal icon click handler
    $('#terminalIcon').on('click', function() {
        launch_app({ name: 'terminal' });
    });
    
    // Trash icon click handler
    $('#trashIcon').on('click', function() {
        let open_windows = $(`.window[data-path="${html_encode(window.trash_path)}"]`);
        if(open_windows.length === 0) {
            launch_app({ name: 'explorer', path: window.trash_path});
        } else {
            open_windows.focusWindow();
        }
    });
    
    // Add hover animation effect
    $('.dock-icon').hover(
        function() {
            // Add scale effect to adjacent icons on hover
            $(this).prev().css('transform', 'scale(1.05)');
            $(this).next().css('transform', 'scale(1.05)');
        },
        function() {
            // Remove scale effect when hover ends
            $(this).prev().css('transform', '');
            $(this).next().css('transform', '');
        }
    );
    
    // Make dock draggable for repositioning
    $('.dock').draggable({
        axis: 'x',
        containment: 'parent',
        stop: function() {
            // Center the dock after dragging
            $(this).css({
                'left': '50%',
                'transform': 'translateX(-50%)'
            });
        }
    });
}

export default UIDock;