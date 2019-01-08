import {Autocomplete} from './autocomplete/autocomplete';
import './autocomplete/autocomplete.less';
import {Dropdown} from "./dropdown/dropdown";
import './dropdown/dropdown.less';


$(function() {

    // autocomplete
    (function () {
        const $input = $('.search-input');
        const searchAutocomplete = new Autocomplete({
            searchInput: $input,
            getData: () => $('.search-text').text(),
        });
        const $startBtn = $('.start-btn');
        const $stopBtn = $('.stop-btn');
        const $destroyBtn = $('.destroy-btn');
        const $setBtn = $('.set-btn');
        const $setInput = $('.set-input');
        const $getBtn = $('.get-btn');

        $startBtn.on('click', () => searchAutocomplete.start());
        $stopBtn.on('click', () => searchAutocomplete.stop());
        $destroyBtn.on('click', () => searchAutocomplete.destroy());
        $setBtn.on('click', () => searchAutocomplete.set($setInput.val()));
        $getBtn.on('click', () => console.log(searchAutocomplete.get()));

        console.dir($);

        $input.on({
            'searchAutocomplete:init': () => console.log('init'),
            'searchAutocomplete:start': () => console.log('start'),
            'searchAutocomplete:stop': () => console.log('stop'),
            'searchAutocomplete:destroy': () => console.log('destroy'),
            'searchAutocomplete:change': (e, val) => console.log('change', val),
        });
    })();

    // dropdown div
    (function () {
        const dropdown = new Dropdown({
            parent: '.dropdown-div',
            fields: [
                {label: 'hello', value: 0},
                {label: 'buy', value: 1},
                {label: 'bon appetite', value: 2},
            ],
        });

        console.dir(dropdown);
    })();

    //dropdown select
    (function () {
        const dropdown = new Dropdown({
            parent: '.dropdown-select',
        });

        console.dir(dropdown);
    })();
});