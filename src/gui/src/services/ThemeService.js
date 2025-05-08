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

import UIAlert from "../UI/UIAlert.js";
import { Service } from "../definitions.js";

const PUTER_THEME_DATA_FILENAME = '~/.__puter_gui.json';

const SAVE_COOLDOWN_TIME = 1000;

const default_values = {
    sat: 41.18,
    hue: 210,
    lig: 93.33,
    alpha: 0.8,
    light_text: false,
    theme_mode: 'dark', // 'dark' or 'light'
};

export class ThemeService extends Service {
    #broadcastService;

    async _init () {
        this.#broadcastService = globalThis.services.get('broadcast');

        this.state = {
            sat: 41.18,
            hue: 210,
            lig: 93.33,
            alpha: 0.8,
            light_text: false,
            theme_mode: 'dark',
        };
        this.root = document.querySelector(':root');
        
        this.save_cooldown_ = undefined;

        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            this.state.theme_mode = 'light';
            document.body.classList.add('light-theme');
        }

        let data = undefined;
        try {
            data = await puter.fs.read(PUTER_THEME_DATA_FILENAME);
            if ( typeof data === 'object' ) {
                data = await data.text();
            }
        } catch (e) {
            if ( e.code !== 'subject_does_not_exist' ) {
                // TODO: once we have an event log,
                //       log this error to the event log
                console.error(e);

                // We don't show an alert because it's likely
                // other things also aren't working.
            }
        }

        if ( data ) try {
            data = JSON.parse(data.toString());
        } catch (e) {
            data = undefined;
            console.error(e);

            UIAlert({
                title: 'Error loading theme data',
                message: `Could not parse "${PUTER_THEME_DATA_FILENAME}": ` +
                    e.message,
            });
        }

        if ( data && data.colors ) {
            this.state = {
                ...this.state,
                ...data.colors,
            };
            this.reload_();
        }
        
        // Listen for system color scheme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only change theme if user hasn't explicitly set a preference
            if (!localStorage.getItem('theme')) {
                this.toggleTheme(!e.matches);
            }
        });
    }

    reset () {
        this.state = default_values;
        this.reload_();
        puter.fs.delete(PUTER_THEME_DATA_FILENAME);
    }

    apply (values) {
        this.state = {
            ...this.state,
            ...values,
        };
        this.reload_();
        this.save_();
    }

    get (key) { return this.state[key]; }
    
    /**
     * Toggle between light and dark theme
     * @param {boolean} isLight - Whether to set light theme (true) or dark theme (false)
     */
    toggleTheme(isLight) {
        if (isLight) {
            document.body.classList.add('light-theme');
            this.state.theme_mode = 'light';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            this.state.theme_mode = 'dark';
            localStorage.setItem('theme', 'dark');
        }
        
        // Broadcast theme change
        this.#broadcastService.sendBroadcast('themeToggled', {
            isLight: isLight
        }, { sendToNewAppInstances: true });
        
        this.save_();
    }

    reload_() {
        const s = this.state;
        this.root.style.setProperty('--primary-hue', s.hue);
        this.root.style.setProperty('--primary-saturation', s.sat + '%');
        this.root.style.setProperty('--primary-lightness', s.lig + '%');
        this.root.style.setProperty('--primary-alpha', s.alpha);
        this.root.style.setProperty('--primary-color', s.light_text ? 'white' : '#373e44');
        this.root.style.setProperty('--primary-color-icon', s.light_text ? 'invert(1)' : 'invert(0)');
        this.root.style.setProperty('--primary-color-sidebar-item', s.light_text ? '#5a5d61aa' : '#fefeff');

        // Broadcast theme change
        this.#broadcastService.sendBroadcast('themeChanged', {
            palette: {
                primaryHue: s.hue,
                primarySaturation: s.sat + '%',
                primaryLightness: s.lig + '%',
                primaryAlpha: s.alpha,
                primaryColor: s.light_text ? 'white' : '#373e44',
                themeMode: s.theme_mode,
            },
        }, { sendToNewAppInstances: true });
    }   

    save_ () {
        if ( this.save_cooldown_ ) {
            clearTimeout(this.save_cooldown_);
        }
        this.save_cooldown_ = setTimeout(() => {
            this.commit_save_();
        }, SAVE_COOLDOWN_TIME);
    }
    
    commit_save_ () {
        puter.fs.write(PUTER_THEME_DATA_FILENAME, JSON.stringify(
            { colors: this.state },
            undefined,
            5,
        ));
    }
}
