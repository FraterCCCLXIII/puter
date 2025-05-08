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

import UITaskbarItem from './UITaskbarItem.js'
import UIPopover from './UIPopover.js'
import launch_app from "../helpers/launch_app.js"

async function UITaskbar(options){
    window.global_element_id++;

    options = options ?? {};
    options.content = options.content ?? '';

    // get launch apps
    $.ajax({
        url: window.api_origin + "/get-launch-apps?icon_size=64",
        type: 'GET',
        async: true,
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer "+window.auth_token
        },
        success: function (apps){ 
            window.launch_apps = apps;
        }
    });

    let h = '';
    h += `<div id="ui-taskbar_${window.global_element_id}" class="taskbar" style="height:${window.taskbar_height}px;">`;
        // Left section
        h += `<div class="taskbar-left-items">`;
            h += `<div class="taskbar-icon" id="toggleSidebar">`;
                h += `<i class="iconoir-menu"></i>`;
            h += `</div>`;
            
            // App name/title
            h += `<div class="taskbar-app-title">Puter</div>`;
            h += `<div class="taskbar-icon" id="calendarBtn">`;
                h += `<i class="iconoir-calendar"></i>`;
            h += `</div>`;
            h += `<div class="dropdown" id="mailDropdown">`;
                h += `<div class="taskbar-icon" id="mailBtn">`;
                    h += `<i class="iconoir-mail"></i>`;
                    h += `<span class="notification-badge">3</span>`;
                h += `</div>`;
            h += `</div>`;
            h += `<div class="taskbar-icon" id="searchBtn">`;
                h += `<i class="iconoir-search"></i>`;
            h += `</div>`;
        h += `</div>`;
        
        // Center section with sortable taskbar items
        h += `<div class="taskbar-center-items">`;
            h += `<div class="taskbar-sortable" style="display: flex; justify-content: center; z-index: 99999;"></div>`;
        h += `</div>`;
        
        // Right section with theme toggle and system icons
        h += `<div class="taskbar-right-items">`;
            h += `<div class="dropdown" id="wifiDropdown">`;
                h += `<div class="taskbar-icon" id="wifiBtn">`;
                    h += `<i class="iconoir-wifi"></i>`;
                h += `</div>`;
            h += `</div>`;
            h += `<div class="dropdown" id="batteryDropdown">`;
                h += `<div class="taskbar-icon" id="batteryBtn">`;
                    h += `<i class="iconoir-battery-75"></i>`;
                h += `</div>`;
            h += `</div>`;
            h += `<div class="dropdown" id="themeDropdown">`;
                h += `<div class="taskbar-icon" id="themeToggleBtn">`;
                    h += `<i class="iconoir-half-moon theme-toggle-icon"></i>`;
                h += `</div>`;
            h += `</div>`;
            h += `<div class="dropdown" id="menuDropdown">`;
                h += `<div class="taskbar-icon" id="menuBtn">`;
                    h += `<i class="iconoir-more-vert"></i>`;
                h += `</div>`;
            h += `</div>`;
        h += `</div>`;
    h += `</div>`;


    $('.desktop').append(h);
    
    // Add dropdown menus HTML
    // Mail dropdown
    const mailDropdownHTML = `
        <div class="dropdown-content">
            <div class="dropdown-header">Messages</div>
            <div class="dropdown-item">
                <i class="iconoir-user-circle"></i>
                <div>
                    <div class="mail-subject">Project Update</div>
                    <div class="mail-summary">The latest designs are ready for review...</div>
                    <div class="mail-time">10:15 AM</div>
                </div>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-user-circle"></i>
                <div>
                    <div class="mail-subject">Team Meeting</div>
                    <div class="mail-summary">Reminder: We have a team meeting at 2 PM...</div>
                    <div class="mail-time">9:30 AM</div>
                </div>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-user-circle"></i>
                <div>
                    <div class="mail-subject">Weekly Report</div>
                    <div class="mail-summary">Please submit your weekly report by Friday...</div>
                    <div class="mail-time">Yesterday</div>
                </div>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-inbox"></i>
                <span>View All Messages</span>
            </div>
        </div>
    `;
    $('#mailDropdown').append(mailDropdownHTML);
    
    // WiFi dropdown
    const wifiDropdownHTML = `
        <div class="dropdown-content">
            <div class="dropdown-item">
                <i class="iconoir-wifi"></i>
                <span>Wi-Fi Networks</span>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-internet"></i>
                <span>Ethernet</span>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-settings"></i>
                <span>Network Settings</span>
            </div>
        </div>
    `;
    $('#wifiDropdown').append(wifiDropdownHTML);
    
    // Battery dropdown
    const batteryDropdownHTML = `
        <div class="dropdown-content">
            <div class="dropdown-item">
                <i class="iconoir-battery-75"></i>
                <span>75% Battery</span>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-flash"></i>
                <span>Power Settings</span>
            </div>
        </div>
    `;
    $('#batteryDropdown').append(batteryDropdownHTML);
    
    // Theme dropdown
    const themeDropdownHTML = `
        <div class="dropdown-content">
            <div class="dropdown-header">Appearance</div>
            <div class="dropdown-item theme-option" data-theme="light">
                <i class="iconoir-sun-light"></i>
                <span>Light Mode</span>
            </div>
            <div class="dropdown-item theme-option" data-theme="dark">
                <i class="iconoir-half-moon"></i>
                <span>Dark Mode</span>
            </div>
            <div class="dropdown-item theme-option" data-theme="auto">
                <i class="iconoir-device-desktop"></i>
                <span>System Default</span>
            </div>
        </div>
    `;
    $('#themeDropdown').append(themeDropdownHTML);
    
    // Menu dropdown
    const menuDropdownHTML = `
        <div class="dropdown-content">
            <div class="dropdown-item">
                <i class="iconoir-user"></i>
                <span>My Account</span>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-settings"></i>
                <span>System Settings</span>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-help-circle"></i>
                <span>Help & Support</span>
            </div>
            <div class="dropdown-item">
                <i class="iconoir-log-out"></i>
                <span>Sign Out</span>
            </div>
        </div>
    `;
    $('#menuDropdown').append(menuDropdownHTML);
    
    // Initialize theme toggle
    const themeService = globalThis.services.get('theme');
    const themeToggleBtn = $('#themeToggleBtn');
    const icon = themeToggleBtn.find('.theme-toggle-icon');
    
    // Set initial state based on current theme
    if (document.body.classList.contains('light-theme')) {
        icon.removeClass('iconoir-half-moon').addClass('iconoir-sun-light');
    }
    
    // Add click event to theme options
    $('.theme-option').on('click', function() {
        const selectedTheme = $(this).data('theme');
        
        // Update the icon in the taskbar
        if (selectedTheme === 'light') {
            icon.removeClass('iconoir-half-moon iconoir-device-desktop').addClass('iconoir-sun-light');
            themeService.setTheme('light');
        } else if (selectedTheme === 'dark') {
            icon.removeClass('iconoir-sun-light iconoir-device-desktop').addClass('iconoir-half-moon');
            themeService.setTheme('dark');
        } else if (selectedTheme === 'auto') {
            icon.removeClass('iconoir-sun-light iconoir-half-moon').addClass('iconoir-device-desktop');
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeService.setTheme(prefersDark ? 'dark' : 'light');
            
            // Add listener for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                themeService.setTheme(e.matches ? 'dark' : 'light');
            });
        }
        
        // Close the dropdown
        $('#themeDropdown').removeClass('active');
    });
    
    // Initialize dropdown functionality
    $('.dropdown').each(function() {
        const dropdown = $(this);
        const trigger = dropdown.find('.taskbar-icon');
        
        trigger.on('click', function(e) {
            e.stopPropagation();
            
            // Close all other dropdowns
            $('.dropdown').not(dropdown).removeClass('active');
            
            // Toggle current dropdown
            dropdown.toggleClass('active');
        });
    });
    
    // Close dropdowns when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown').removeClass('active');
        }
    });
    
    // Add time display to the center if needed
    const updateTime = function() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        
        if ($('#time-display').length === 0) {
            const timeHtml = `
                <div class="time-display" id="time-display">
                    <span id="time">${timeStr}</span>
                    <span class="date-display" id="date">${dateStr}</span>
                </div>
            `;
            $('.taskbar-center-items').append(timeHtml);
        } else {
            $('#time').text(timeStr);
            $('#date').text(dateStr);
        }
    };
    
    // Update time immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);


    //---------------------------------------------
    // add `Start` to taskbar
    //---------------------------------------------
    UITaskbarItem({
        icon: window.icons['start.svg'],
        name: i18n('start'),
        sortable: false,
        keep_in_taskbar: true,
        disable_context_menu: true,
        onClick: async function(item){
            // skip if popover already open
            if($(item).hasClass('has-open-popover'))
                return;

            // show popover
            let popover = UIPopover({
                content: `<div class="launch-popover hide-scrollbar"></div>`,
                snapToElement: item,
                parent_element: item,
                width: 500,
                height: 500,
                class: 'popover-launcher',
                center_horizontally: true,
            });

            // In the rare case that launch_apps is not populated yet, get it from the server
            // then populate the popover
            if(!window.launch_apps || !window.launch_apps.recent || window.launch_apps.recent.length === 0){
                // get launch apps
                window.launch_apps = await $.ajax({
                    url: window.api_origin + "/get-launch-apps?icon_size=64",
                    type: 'GET',
                    async: true,
                    contentType: "application/json",
                    headers: {
                        "Authorization": "Bearer "+window.auth_token
                    },
                });
            }
            
            let apps_str = '';

            apps_str += `<div class="launch-search-wrapper">`
                apps_str += `<input style="background-image:url('${window.icons['magnifier-outline.svg']}');" class="launch-search">`;
                apps_str += `<img class="launch-search-clear" src="${window.icons['close.svg']}">`;
            apps_str += `</div>`;

            // -------------------------------------------
            // Recent apps
            // -------------------------------------------
            if(window.launch_apps.recent.length > 0){
                // heading
                apps_str += `<h1 class="start-section-heading start-section-heading-recent">${i18n('recent')}</h1>`;

                // apps
                apps_str += `<div class="launch-apps-recent">`;
                for (let index = 0; index < window.launch_recent_apps_count && index < window.launch_apps.recent.length; index++) {
                    const app_info = window.launch_apps.recent[index];
                    apps_str += `<div title="${html_encode(app_info.title)}" data-name="${html_encode(app_info.name)}" class="start-app-card">`;
                        apps_str += `<div class="start-app" data-app-name="${html_encode(app_info.name)}" data-app-uuid="${html_encode(app_info.uuid)}" data-app-icon="${html_encode(app_info.icon)}" data-app-title="${html_encode(app_info.title)}">`;
                            apps_str += `<img class="start-app-icon" src="${html_encode(app_info.icon ? app_info.icon : window.icons['app.svg'])}">`;
                            apps_str += `<span class="start-app-title">${html_encode(app_info.title)}</span>`;
                        apps_str += `</div>`;
                    apps_str += `</div>`;
                }
                apps_str += `</div>`;
            }
            // -------------------------------------------
            // Reccomended apps
            // -------------------------------------------
            if(window.launch_apps.recommended.length > 0){
                // heading
                apps_str += `<h1 class="start-section-heading start-section-heading-recommended" style="${window.launch_apps.recent.length > 0 ? 'padding-top: 30px;' : ''}">${i18n('recommended')}</h1>`;
                // apps
                apps_str += `<div class="launch-apps-recommended">`;
                for (let index = 0; index < window.launch_apps.recommended.length; index++) {
                    const app_info = window.launch_apps.recommended[index];
                    apps_str += `<div title="${html_encode(app_info.title)}" data-name="${html_encode(app_info.name)}" class="start-app-card">`;
                        apps_str += `<div class="start-app" data-app-name="${html_encode(app_info.name)}" data-app-uuid="${html_encode(app_info.uuid)}" data-app-icon="${html_encode(app_info.icon)}" data-app-title="${html_encode(app_info.title)}">`;
                            apps_str += `<img class="start-app-icon" src="${html_encode(app_info.icon ? app_info.icon : window.icons['app.svg'])}">`;
                            apps_str += `<span class="start-app-title">${html_encode(app_info.title)}</span>`;
                        apps_str += `</div>`;
                    apps_str += `</div>`;
                }
                apps_str += `</div>`;
            }

            // add apps to popover
            $(popover).find('.launch-popover').append(apps_str);

            // focus on search input only if not on mobile
            if(!isMobile.phone)
                $(popover).find('.launch-search').focus();

            // make apps draggable
            $(popover).find('.start-app').draggable({
                appendTo: "body",
                revert: "invalid",
                connectToSortable: ".taskbar-sortable",
                zIndex: parseInt($(popover).css('z-index')) + 1,
                scroll: false,
                distance: 5,
                revertDuration: 100,
                helper: 'clone',
                cursorAt: { left: 18, top: 20 },
                start: function(event, ui){
                },
                drag: function(event, ui){
                },
                stop: function(){
                }
            });
        }
    });

    //---------------------------------------------
    // add `Explorer` to the taskbar
    //---------------------------------------------
    UITaskbarItem({
        icon: window.icons['folders.svg'],
        app: 'explorer',
        name: 'Explorer',
        sortable: false,
        keep_in_taskbar: true,
        lock_keep_in_taskbar: true,
        onClick: function(){
            let open_window_count = parseInt($(`.taskbar-item[data-app="explorer"]`).attr('data-open-windows'));
            if(open_window_count === 0){
                launch_app({ name: 'explorer', path: window.home_path});
            }else{
                return false;
            }
        }
    })

    //---------------------------------------------
    // Add other useful apps to the taskbar
    //---------------------------------------------
    if(window.user.taskbar_items && window.user.taskbar_items.length > 0){
        for (let index = 0; index < window.user.taskbar_items.length; index++) {
            const app_info = window.user.taskbar_items[index];
            // add taskbar item for each app
            UITaskbarItem({
                icon: app_info.icon,
                app: app_info.name,
                name: app_info.title,
                keep_in_taskbar: true,
                onClick: function(){
                    let open_window_count = parseInt($(`.taskbar-item[data-app="${app_info.name}"]`).attr('data-open-windows'));
                    if(open_window_count === 0){
                        launch_app({
                            name: app_info.name,
                        }) 
                    }else{
                        return false;
                    }
                }
            });
        }
    }

    //---------------------------------------------
    // add `Trash` to the taskbar
    //---------------------------------------------
    const trash = await puter.fs.stat(window.trash_path);
    if(window.socket){
        window.socket.emit('trash.is_empty', {is_empty: trash.is_empty});
    }

    UITaskbarItem({
        icon: trash.is_empty ? window.icons['trash.svg'] : window.icons['trash-full.svg'],
        app: 'trash',
        name: `${i18n('trash')}`,
        sortable: false,
        keep_in_taskbar: true,
        lock_keep_in_taskbar: true,
        onClick: function(){
            let open_windows = $(`.window[data-path="${html_encode(window.trash_path)}"]`);
            if(open_windows.length === 0){
                launch_app({ name: 'explorer', path: window.trash_path});
            }else{
                open_windows.focusWindow();
            }
        },
        onItemsDrop: function(items){
            window.move_items(items, window.trash_path);
        }
    })

    window.make_taskbar_sortable();
}

window.make_taskbar_sortable = function(){
    //-------------------------------------------
    // Taskbar is sortable
    //-------------------------------------------
    $('.taskbar-sortable').sortable({
        axis: "x",
        items: '.taskbar-item-sortable:not(.has-open-contextmenu)',
        cancel: '.has-open-contextmenu',
        placeholder: "taskbar-item-sortable-placeholder",
        helper : 'clone',
        distance: 5,
        revert: 10,
        receive: function(event, ui){
            if(!$(ui.item).hasClass('taskbar-item')){
                // if app is already in taskbar, cancel
                if($(`.taskbar-item[data-app="${$(ui.item).attr('data-app-name')}"]`).length !== 0){
                    $(this).sortable('cancel');
                    $('.taskbar .start-app').remove();
                    return;
                }
            }
        },
        update: function(event, ui){
            if(!$(ui.item).hasClass('taskbar-item')){
                // if app is already in taskbar, cancel
                if($(`.taskbar-item[data-app="${$(ui.item).attr('data-app-name')}"]`).length !== 0){
                    $(this).sortable('cancel');
                    $('.taskbar .start-app').remove();
                    return;
                }
                
                let item = UITaskbarItem({
                    icon: $(ui.item).attr('data-app-icon'),
                    app: $(ui.item).attr('data-app-name'),
                    name: $(ui.item).attr('data-app-title'),
                    append_to_taskbar: false,
                    keep_in_taskbar: true,
                    onClick: function(){
                        let open_window_count = parseInt($(`.taskbar-item[data-app="${$(ui.item).attr('data-app-name')}"]`).attr('data-open-windows'));
                        if(open_window_count === 0){
                            launch_app({
                                name: $(ui.item).attr('data-app-name'),
                            }) 
                        }else{
                            return false;
                        }
                    }
                });
                let el = ($(item).detach())
                $(el).insertAfter(ui.item);
                $(el).show();
                $(ui.item).removeItems();
                window.update_taskbar();
            }
            // only proceed to update DB if the item sorted was a pinned item otherwise no point in updating the taskbar in DB
            else if($(ui.item).attr('data-keep-in-taskbar') === 'true'){
                window.update_taskbar();
            }
        },
    });
}

export default UITaskbar;