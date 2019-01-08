import {Autocomplete} from './autocomplete/autocomplete';
import './autocomplete/autocomplete.less';
import {Dropdown} from "./dropdown/dropdown";
import './dropdown/dropdown.less';


$(function() {

    // autocomplete
    (function () {
        const $wrapper = $('.autocomplete');
        const $input = $wrapper.find('.search-input');
        const autocomplete = new Autocomplete({
            searchInput: $input,
            getData: () => $wrapper.find('.search-text').text(),
        });
        const $startBtn = $wrapper.find('.start-btn');
        const $stopBtn = $wrapper.find('.stop-btn');
        const $destroyBtn = $wrapper.find('.destroy-btn');
        const $setBtn = $wrapper.find('.set-btn');
        const $setInput = $wrapper.find('.set-input');
        const $getBtn = $wrapper.find('.get-btn');

        $startBtn.on('click', () => autocomplete.start());
        $stopBtn.on('click', () => autocomplete.stop());
        $destroyBtn.on('click', () => autocomplete.destroy());
        $setBtn.on('click', () => autocomplete.set($setInput.val()));
        $getBtn.on('click', () => console.log(autocomplete.get()));

        console.dir(autocomplete);

        $input.on({
            'autocomplete:init': () => console.log('init'),
            'autocomplete:start': () => console.log('start'),
            'autocomplete:stop': () => console.log('stop'),
            'autocomplete:destroy': () => console.log('destroy'),
            'autocomplete:change': (e, val) => console.log('change', val),
        });
    })();

    // dropdown div
    (function () {
        const $wrapper = $('.dropdown-div');
        const $target = $wrapper.find('.target');
        const dropdown = new Dropdown({
            parent: $target,
            fields: [
                {label: 'hello', value: 0},
                {label: 'buy', value: 1},
                {label: 'bon appetite', value: 2},
            ],
        });
        const $startBtn = $wrapper.find('.start-btn');
        const $stopBtn = $wrapper.find('.stop-btn');
        const $destroyBtn = $wrapper.find('.destroy-btn');
        const $setBtn = $wrapper.find('.set-btn');
        const $setLabelInput = $wrapper.find('.set-label-input');
        const $setValueInput = $wrapper.find('.set-value-input');
        const $addBtn = $wrapper.find('.add-btn');
        const $addLabelInput = $wrapper.find('.add-label-input');
        const $addValueInput = $wrapper.find('.add-value-input');
        const $getBtn = $wrapper.find('.get-btn');

        $startBtn.on('click', () => dropdown.start());
        $stopBtn.on('click', () => dropdown.stop());
        $destroyBtn.on('click', () => dropdown.destroy());
        $setBtn.on('click', () => {
            const label = $setLabelInput.val();
            const value = $setValueInput.val();

            dropdown.set(label, value);
        });
        $addBtn.on('click', () => {
            const label = $addLabelInput.val();
            const value = $addValueInput.val();

            dropdown.add(label, value);
        });
        $getBtn.on('click', () => console.log(dropdown.get()));

        $target.on({
            'dropdown:init': () => console.log('init'),
            'dropdown:start': () => console.log('start'),
            'dropdown:stop': () => console.log('stop'),
            'dropdown:destroy': () => console.log('destroy'),
            'dropdown:change': (e, val) => console.log('change', val),
            'dropdown:list:shown': () => console.log('list shown'),
            'dropdown:list:hidden': () => console.log('list hidden'),
        });

        console.dir(dropdown);
    })();

    //dropdown select
    (function () {
        const $wrapper = $('.dropdown-select');
        const $target = $wrapper.find('.target');
        const dropdown = new Dropdown({
            parent: $target,
        });
        const $startBtn = $wrapper.find('.start-btn');
        const $stopBtn = $wrapper.find('.stop-btn');
        const $destroyBtn = $wrapper.find('.destroy-btn');
        const $setBtn = $wrapper.find('.set-btn');
        const $setLabelInput = $wrapper.find('.set-label-input');
        const $setValueInput = $wrapper.find('.set-value-input');
        const $addBtn = $wrapper.find('.add-btn');
        const $addLabelInput = $wrapper.find('.add-label-input');
        const $addValueInput = $wrapper.find('.add-value-input');
        const $getBtn = $wrapper.find('.get-btn');

        $startBtn.on('click', () => dropdown.start());
        $stopBtn.on('click', () => dropdown.stop());
        $destroyBtn.on('click', () => dropdown.destroy());
        $setBtn.on('click', () => {
            const label = $setLabelInput.val();
            const value = $setValueInput.val();

            dropdown.set(label, value);
        });
        $addBtn.on('click', () => {
            const label = $addLabelInput.val();
            const value = $addValueInput.val();

            dropdown.add(label, value);
        });
        $getBtn.on('click', () => console.log(dropdown.get()));

        $target.on({
            'dropdown:init': () => console.log('init'),
            'dropdown:start': () => console.log('start'),
            'dropdown:stop': () => console.log('stop'),
            'dropdown:destroy': () => console.log('destroy'),
            'dropdown:change': (e, val) => console.log('change', val),
            'dropdown:list:shown': () => console.log('list shown'),
            'dropdown:list:hidden': () => console.log('list hidden'),
        });

        console.dir(dropdown);
    })();
});