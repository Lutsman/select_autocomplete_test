export class Autocomplete {
    constructor(options) {
        this.data = options.data;
        this.getData = options.getData;
        this.searchInput = options.searchInput;
        this.minCount = options.minCount || 3;
        this.$searchInput = null;
        this.$autocompleteList = null;
        this.$body = null;
        this.formatedData = [];
        this.isWorking = false;
        this.isDestroyed = false;
        this.isShownList = false;
        this.isChoosed = false;
        this.activeValue = null;
        this.isOuterClickHandled = false;
        this.classNames = {
            list: 'autocomplete__list',
        };
        this.events = {
            init: 'searchAutocomplete:init',
            start: 'searchAutocomplete:start',
            stop: 'searchAutocomplete:stop',
            destroy: 'searchAutocomplete:destroy',
            change: 'searchAutocomplete:change',
        };

        this.init();
    }

    init() {
        this.bindElements();
        this.preRenderList();
        this.attachHandlers();
        this.formatedData = this.getFormatedData();

        this.isWorking = true;
        this.$searchInput.trigger(this.events.init, {controller: this});
    }

    bindElements() {
        this.$searchInput = $(this.searchInput);
        this.$body = $('body');
    }

    attachHandlers() {
        this.$searchInput.on('input', this.inputChangeHandler);
        this.$autocompleteList.on('click', this.autocompleteChooseHandler);
    }

    detachHandlers() {
        this.$searchInput.off('input', this.inputChangeHandler);
        this.$autocompleteList.off('click', this.autocompleteChooseHandler);
        this.$body.off('click', this.outerClickHandler);
    }

    preRenderList() {
        this.$autocompleteList = $(`<ul class="${this.classNames.list}"></ul>`);
        this.$autocompleteList
            .appendTo(this.$body)
            .hide();
    }

    renderList(words) {
        const $list = this.$autocompleteList;

        $list.empty();

        for (const word of words) {
            const listItem = `<li>${word}</li>`;
            $list.append(listItem);
        }
    }

    setListPosition() {
        const inputPos = this.getPosition(this.$searchInput);

        this.$autocompleteList.css({
            top: inputPos.bottom,
            left: inputPos.left,
        });
    }

    showList(ms) {
        this.setListPosition();
        return new Promise(resolve => {
            this.$autocompleteList.fadeIn(ms || 100, () => {
                this.setListPosition();
                this.isShownList = true;
                resolve();
            });
        });
    }

    hideList(ms) {
        return new Promise(resolve => {
            this.$autocompleteList.fadeOut(ms || 100, () => {
                this.isShownList = false;
                resolve();
            });
        });
    }

    removeList() {
        this.$autocompleteList.remove();
        this.$autocompleteList = null;
    }

    inputChangeHandler = e => {
        const val = e.target.value;

        this.isChoosed = false;

        if (!this.isOuterClickHandled) {
            this.$body.on('click', this.outerClickHandler);
            this.isOuterClickHandled = true;
        }

        if (!val || val.length < this.minCount) {
            this.hideList();
            return;
        }

        const purposalWords = this.getPurposalWords(this.formatedData, val);

        if (!purposalWords.length) {
            this.hideList();
            return;
        }

        this.renderList(purposalWords);
        this.showList();
    };

    autocompleteChooseHandler = e => {
        const target = e.target;
        const li = target.closest('li');

        if (!li) return;

        this.set(li.textContent);
        this.hideList();
    };

    outerClickHandler = e => {
        const $target = $(e.target);
        const $list = $target.closest(this.$autocompleteList);

        if ($list.length) return;

        if (!this.isChoosed) {
            this.reset();
        }

        this.hideList();
        this.$body.off('click', this.outerClickHandler);
        this.isOuterClickHandled = false;
    };

    getPosition($el) {
        const box = $el.offset();

        return {
            top: box.top,
            bottom: box.top + $el.height(),
            left: box.left,
            right: box.left + $el.width(),
        };
    }

    getFormatedData() {
        if (this.data) {
            return this.parseData(this.data);
        }

        if (typeof this.getData !== 'function') {
            return [];
        }

        const data = this.getData();

        if (typeof data.then === 'function') {
            return this.getData().then(data => this.parseData(data));
        }

        return this.parseData(data);
    }

    parseData(data) {
        let processedData = data;

        if (typeof data === 'string') {
            processedData = data.split(' ');
        }

        processedData = processedData.reduce((arr, str) => {
            let word = this.removeSymbols(str)
                .toLowerCase();

            if (word) {
                arr.push(word);
            }

            return arr;
        }, []);

        return this.removeRepetition(processedData);
    }

    removeSymbols(str) {
        return str.replace(/[^A-Za-z0-9\u0400-\u04FF]/g, '');
    }

    removeRepetition(data) {
        let processedData = [...data];

        for (let i = 0; i < processedData.length; i++) {
            let j = i + 1;

            while (j < processedData.length) {
                if (processedData[i] === processedData[j]) {
                    processedData.splice(j, 1);
                    continue;
                }

                j++;
            }
        }

        return processedData;
    }

    getPurposalWords(searchData, searchText) {
        const searchTextLowered = searchText.toLowerCase();

        return searchData.reduce((arr, word) => {
            const startPos = word.indexOf(searchTextLowered);

            if (~startPos){
                const highlightedWord = this.highlightWord(word, searchText);
                arr.push(highlightedWord);
            }

            return arr;
        }, []);
    }

    highlightWord(word, pattern) {
        const entries = this.getAllEntries(word, pattern);

        if (!entries.length) return null;

        let template = word.slice(0, entries[0]);

        for (let i = 0; i < entries.length; i++) {
            template += `<span>${pattern}</span>${word.slice(entries[i] + pattern.length, entries[i+1])}`;
        }

        return template;
    }

    getAllEntries(str, pattern) {
        let result = [];
        let i = 0;

        while(i < str.length) {
            const startPos = str.indexOf(pattern, i);

            if (!~startPos) break;

            result.push(startPos);
            i = startPos + pattern.length;
        }

        return result;
    }

    changeInputValue(val) {
        this.$searchInput.val(val);
    }

    set(val) {
        if (val) {
            this.changeInputValue(val);
            this.activeValue = val;
            this.isChoosed = true;
            this.$searchInput.trigger(this.events.change, val);
        } else {
            this.changeInputValue(null);
            this.activeValue = null;
            this.isChoosed = false;
            this.$searchInput.trigger(this.events.change, null);
        }
    }

    get() {
        return this.activeValue;
    }

    reset() {
        this.set(null);
    }

    start() {
        if (this.isWorking) return;

        if (this.isDestroyed) {
            this.preRenderList();
            this.isDestroyed = false;
        }

        this.attachHandlers();
        this.isWorking = true;
        this.$searchInput.trigger(this.events.start, {controller: this});
    };

    stop() {
        if (this.isDestroyed) return;

        this.detachHandlers();
        return this.hideList()
            .then(() => {
                this.isWorking = false;
                this.$searchInput.trigger(this.events.stop, {controller: this});
            });
    };

    destroy() {
        if (this.isDestroyed) return;

        return this.stop()
            .then(() => {
                this.removeList();
                this.isDestroyed = true;
                this.$searchInput.trigger(this.events.destroy, {controller: this});
            });
    };
}