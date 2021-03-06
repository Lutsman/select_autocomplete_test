export class Dropdown {
    constructor(options) {
        this.userFields = options.fields || null; // [{ label: string, value: any}]
        this.fields = []; // [{ label: string, value: any}]
        this.activeField = null;
        this.target = options.target;
        this.$target = null;
        this.$select = null;
        this.isWorking = false;
        this.isDestroyed = false;
        this.isShownList = false;
        this.isOuterClickHandled = false;
        this.userDropdownClass = options.dropdownClass || null;
        this.userListClass = options.listClass || null;
        this.classNames = {
            dropdown: 'dropdown__wrapper',
            label: 'dropdown__label',
            active: 'dropdown__list-active',
            selected: 'dropdown__selected',
            resetBtn: 'dropdown__reset-btn',
            list: 'dropdown__list',
        };
        this.events = {
            init: 'dropdown:init',
            start: 'dropdown:start',
            stop: 'dropdown:stop',
            destroy: 'dropdown:destroy',
            change: 'dropdown:change',
            listShown: 'dropdown:list:shown',
            listHidden: 'dropdown:list:hidden',
        };

        this.init();
    }

    init() {
        this.bindElements();
        this.renderDropdown();
        this.attachHandlers();
        this.fields = this.getFields();
        this.fillUpList();

        this.isWorking = true;
        this.$dropdown.trigger(this.events.init, {controller: this});
        if (this.$select) {
            this.$select.trigger(this.events.init, {controller: this});
        }
    }

    bindElements() {
        this.$body = $('body');
        this.$target = $(this.target);
        this.$select = this.$target.is('select') ? this.$target : null;
    }

    attachHandlers() {
        this.$dropdown.on('click', this.dropdownClickHandler);
        this.$list.on('click', this.listClickHandler);
    }

    detachHandlers() {
        this.$dropdown.off('click', this.dropdownClickHandler);
        this.$list.off('click', this.listClickHandler);
        this.$body.off('click', this.outerClickHandler);
    }

    renderDropdown() {
        this.$dropdown = $(`<div class="${this.classNames.dropdown} ${this.userDropdownClass || ''}"></div>`);
        this.$label = $(`<div class="${this.classNames.label}"></div>`);
        this.$resetBtn = $(`<div class="${this.classNames.resetBtn}"></div>`);
        this.$list = $(`<ul class="${this.classNames.list} ${this.userListClass || ''}"></ul>`);

        this.$dropdown
            .append(this.$label)
            .append(this.$resetBtn);

        this.$body
            .append(this.$list);

        if (this.$select && this.$select.length) {
            this.$select
                .replaceWith(this.$dropdown)
                .appendTo(this.$dropdown)
                .hide();
        } else {
            this.$target.append(this.$dropdown);
        }
    }

    removeDropdown() {
        if (this.$select && this.$select.length) {
            this.$dropdown.replaceWith(this.$select);
            this.$select.show();
        } else {
            this.$dropdown.remove();
        }

        this.$list.remove();
        this.$dropdown = null;
        this.$label = null;
        this.$resetBtn = null;
        this.$list = null;
        this.$listItems = null;
    }

    renderListItems(fields) {
        if (!fields) return;

        let $listItems = $(null);

        for (const field of fields) {
            $listItems = $listItems.add(`<li>${field.label}</li>`);
        }

        return $listItems;
    }

    fillUpList() {
        const fields = this.activeField ? this.fields.filter(field => field.label !== this.activeField.label) : this.fields;
        this.$listItems = this.renderListItems(fields);
        this.$list
            .empty()
            .append(this.$listItems);
    }

    setListPosition() {
        const dropdownPos = this.getPosition(this.$dropdown);
        const maxHeight = this.getMaxHeight(dropdownPos.bottom);
        const minWidth = this.$dropdown.outerWidth();

        this.$list.css({
            top: dropdownPos.bottom,
            left: dropdownPos.left,
            maxHeight: maxHeight + 'px',
            minWidth: minWidth + 'px',
        });
    }

    showList(ms) {
        return new Promise(resolve => {
            this.setListPosition();
            this.$list.fadeIn(ms || 100, () => {
                if (!this.isOuterClickHandled) {
                    this.$body.on('click', this.outerClickHandler);
                    this.isOuterClickHandled = true;
                }
                this.$dropdown.addClass(this.classNames.active);
                this.isShownList = true;
                this.$dropdown.trigger(this.events.listShown, {controller: this});
                if (this.$select) {
                    this.$select.trigger(this.events.listShown, {controller: this});
                }
                resolve();
            });
        });
    }

    hideList(ms) {
        return new Promise(resolve => {
            if (this.isOuterClickHandled) {
                this.$body.off('click', this.outerClickHandler);
                this.isOuterClickHandled = false;
            }

            this.$list.fadeOut(ms || 100, () => {
                this.$dropdown.removeClass(this.classNames.active);
                this.isShownList = false;
                this.$dropdown.trigger(this.events.listHidden, {controller: this});
                if (this.$select) {
                    this.$select.trigger(this.events.listHidden, {controller: this});
                }
                resolve();
            });
        });
    }

    dropdownClickHandler = e => {
        const $target = $(e.target);

        if ($target.closest(this.$resetBtn).length) {
            this.reset();
            return;
        }

        if ($target.closest(this.$label).length) {
            if (this.isShownList) {
                this.hideList();
            } else {
                this.showList();
            }
        }
    };

    listClickHandler = e => {
        const $target = $(e.target);
        const $li = $target.closest(this.$listItems);

        this.set($li.text());
        this.hideList();
    };

    outerClickHandler = e => {
        const $target = $(e.target);
        const $wrapper = $target.closest(this.$dropdown);

        if ($wrapper.length) return;

        this.hideList();
        this.$body.off('click', this.outerClickHandler);
        this.isOuterClickHandled = false;
    };

    getFields() {
        let fields = null;

        if (this.$select && this.$select.length) {
            fields = this.getFieldsFromSelect(this.$select);
        }

        if (Array.isArray(this.userFields) &&
            'label' in this.userFields[0] &&
            'value' in this.userFields[0]) {
            fields = this.removeRepetitions(this.userFields);
        }

        return this.sortFields(fields);
    }

    sortFields(fields) {
        if (!fields) return null;

        return [...fields].sort((x, y) => {
            if (x.label > y.label) {
                return 1;
            }

            if (x.label < y.label) {
                return -1;
            }

            if (x.label === y.label) {
                return 0;
            }
        });
    }

    getFieldsFromSelect($select) {
        const $options = $select.find('option');
        let fields = [];

        $options.each((i, el) => fields.push({
            label: el.textContent,
            value: el.value || el.textContent,
        }));

        return this.removeRepetitions(fields);
    }

    removeRepetitions(fields) {
        let processedFields = [...fields];

        for (let i = 0; i < processedFields.length; i++) {
            let j = i + 1;

            while (j < processedFields.length) {
                if (processedFields[i].label === processedFields[j].label) {
                    processedFields.splice(j, 1);
                    continue;
                }

                j++;
            }
        }

        return processedFields;
    }

    changeLabel() {
        let label;
        let value;

        if (!this.activeField) {
            label = null;
            value = null;
        } else {
            label = this.activeField.label;
            value = this.activeField.value;
        }

        this.$label.text(label);
        this.$dropdown.addClass(this.classNames.selected);
        this.$dropdown.trigger(this.events.change, {field: label ? {label, value} : null});
        if (this.$select) {
            const select = this.$select[0];

            select.value = value ? value : select.defaultSelected;
            this.$select.trigger(this.events.change, {field: label ? {label, value} : null});
        }
    }

    getPosition($el) {
        const box = $el.offset();

        return {
            top: box.top,
            bottom: box.top + $el.outerHeight(),
            left: box.left,
            right: box.left + $el.outerWidth(),
        };
    }

    getMaxHeight(top) {
        const $win = $(window);
        return $win.height() - (top - $win.scrollTop());
    }

    removeSelectOption(label) {
        const select = this.$select[0];
        let index = null;

        for(let i = 0; i < select.length; i++) {
            if (select[i] !== label) continue;

            index = i;
        }

        if (index === null) return;

        select.remove(index);
    }

    add(label, value) {
        if (!label || !value) return;

        let replaced = false;
        let fields = this.fields.map(field => {
            if (field.label === label) {
                replaced = true;
                return {label, value};
            } else {
                return field;
            }
        });

        if (!replaced) {
            fields.push({label, value});
        }

        this.fields = this.sortFields(fields);
        this.fillUpList();

        if(this.$select) {
            const select = this.$select[0];
            const option = $(`<option value="${value}">${label}</option>`)[0];

            if (replaced) {
                this.removeSelectOption(label);
            }

            select.add(option);
        }
    }

    set(label, value) {
        if (!label && !value) return;

        if (label && value) {
            this.add(label, value);
            this.set(label);
        } else if (label) {
            const activeField = this.fields.filter(item => item.label === label)[0];
            if (!activeField) return;

            this.activeField = activeField;
            this.changeLabel(activeField.label);
        } else if (value) {
            const activeField = this.fields.filter(item => item.value === value)[0];
            if (!activeField) return;

            this.activeField = activeField;
            this.changeLabel(activeField.label);
        }

        this.fillUpList();
    }

    remove(label) {
        if (!label || this.fields.length === 0) return;

        const processedFields = this.fields.filter(field => field.label !== label);

        if (processedFields.length === this.fields.length) return;

        if (this.activeField && this.activeField.label === label) {
            this.activeField = null;
        }

        this.fields = processedFields;

        if(this.$select) {
            this.removeSelectOption(label);
        }
    }

    get() {
        return this.activeField; //TODO decide what is better to get label and value or just value?
    }

    reset() {
        this.activeField = null;
        this.changeLabel(null);
        this.$dropdown.removeClass(this.classNames.selected);
        this.fillUpList();
    }

    start() {
        if (this.isWorking) return;

        if (this.isDestroyed) {
            this.renderDropdown();
            this.fillUpList();
            this.isDestroyed = false;
        }

        this.attachHandlers();
        this.isWorking = true;
        this.$dropdown.trigger(this.events.start, {controller: this});
        if (this.$select) {
            this.$select.trigger(this.events.start, {controller: this});
        }
    }

    stop() {
        if (this.isDestroyed) return;

        this.detachHandlers();
        return this.hideList()
            .then(() => {
                this.isWorking = false;
                this.$dropdown.trigger(this.events.stop, {controller: this});
                if (this.$select) {
                    this.$select.trigger(this.events.stop, {controller: this});
                }
            });
    }

    destroy() {
        if (this.isDestroyed) return;

        return this.stop()
            .then(() => {
                this.isDestroyed = true;
                this.$dropdown.trigger(this.events.destroy, {controller: this});
                this.removeDropdown();
                if (this.$select) {
                    this.$select.trigger(this.events.destroy, {controller: this});
                }
            });
    }
}