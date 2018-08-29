/* !
 * Nestable jQuery Plugin - Copyright (c) 2014 Ramon Smit - https://github.com/RamonSmit/Nestable
 */

(function ($, window, document, undefined) {
    let hasTouch = 'ontouchstart' in document;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    let hasPointerEvents = (function () {
        let el = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        let supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    }());

    let branchRightBtns = {
        btnGroup: {
            deleteBranchBtn: {
                class: 'icon-trash',
                onclick(element, promise) {
                    promise.resolve();
                },
            },
            addBranchBtn: {
                class: 'icon-plus',
                onclick(element, promise) {
                    promise.resolve({
                        type: 'branch',
                        name: `branch.${element.parentsUntil(this.el, this.options.listNodeName).length}.${
                            element.children(this.options.listNodeName).children(this.options.itemNodeName).length + 1}`,
                    });
                },
            },
            addLeafBtn: {
                class: 'icon-user-plus',
                onclick(element, promise) {
                    promise.resolve({
                        type: 'leaf',
                        name: `leaf.${element.parentsUntil(this.el, this.options.listNodeName).length}.${
                            element.children(this.options.listNodeName).children(this.options.itemNodeName).length + 1}`,
                        iconclass: 'icon-user',
                    });
                }
            },
            checkboxBtn: {
                cascadeChecked: true, //
                leafDisabled: false, // 可选，默认为false, 当组的checkbox为false时，组下leaf是否会被禁用,
                asynCheck: false, // 是否不需要等异步成功关联修改leaf节点
                onclick(element, promise) {
                    promise.resolve();
                },
            }
        },
    };

    let leafRightBtns = {
        btnGroup: {
            deleteLeafBtn: {
                class: 'icon-trash',
                onclick(element, promise) {
                    promise.resolve();
                },
            },
            checkboxBtn: {
                cascadeChecked: true, // 可选，默认为true,是否要级联修改其父节点的checkbox,
                asynCheck: false, // 是否不需要等异步成功关联修改父节点的checkbox
                onclick(element, promise) {
                    promise.resolve();
                },
            }
        }
    };

    let addRootBtn = {
        show: false,
        class: 'icon-plus-circle',
        label: '添加根节点',
        onclick(element, promise) {
            promise.resolve({
                type: 'branch',
                name: `branch.${element.parentsUntil(this.el, this.options.listNodeName).length}.${
                    element.children(this.options.listNodeName).children(this.options.itemNodeName).length + 1}`,
            });
        },
    };

    let defaults = {
        contentCallback(item) { return item.name || '' ? item.name : item.id; },
        listNodeName: 'ol',
        itemNodeName: 'li',
        handleNodeName: 'div',
        contentNodeName: 'span',
        rootClass: 'dd',
        listClass: 'dd-list',
        itemClass: 'dd-item',
        itemContentRowClass: 'dd-content-row',
        dragClass: 'dd-dragel',
        handleClass: 'dd-handle',
        contentClass: 'dd-content',
        collapsedClass: 'dd-collapsed',
        expandClass: 'dd-expand',
        placeClass: 'dd-placeholder',
        noDragClass: 'dd-nodrag',
        noChildrenClass: 'dd-nochildren',
        emptyClass: 'dd-empty',
        expandBtnHTML: '<button class="dd-expand" data-action="expand" type="button">Expand</button>',
        collapseBtnHTML: '<button class="dd-collapse" data-action="collapse" type="button">Collapse</button>',
        btnsClass: 'dd-actions',
        group: 0,
        maxDepth: 5,
        threshold: 20,
        fixedDepth: false, // fixed item's depth
        fixed: false,
        includeContent: false,
        scroll: false,
        scrollSensitivity: 1,
        scrollSpeed: 5,
        scrollTriggers: {
            top: 40,
            left: 40,
            right: -40,
            bottom: -40
        },
        isolatedClass: 'dd-isolated', // 未分配组类名
        isCollapsedAll: true, // 是否默认全收起
        dragNewbranch: false, // 是否支持拖动创建新上级
        sameLevelDraggable: true, // 是否限制为只可同级拖动排序
        draggable: false, // 是否可拖动排序
        searchable: false, // 是否需要搜索框
        showLeafCheckbox: {
            show: false, // 是否需要添加是否显示叶子的checkbox
            value: true, // 默认是否显示叶子
            label: '显示叶子',
        },
        addRootBtn,
        onDragStop(prev, el, next) {},
        onDragStart(l, e, p) {},
        beforeDragStop(l, e, p) {},
        onSelectRow(element, promise) {},
        listRenderer(children, options, itemParent, list) {
            let html = '';
            if (!itemParent) {
                let leafCheckbox = '';
                if (options.showLeafCheckbox && options.showLeafCheckbox.show) {
                    leafCheckbox = `<div class="checkbox checkbox-primary display-inline leafCheckbox"><input id="dd-search-checkbox" type="checkbox"${
                        options.showLeafCheckbox.value ? ' checked="checked" ' : ''
                    }><label>${options.showLeafCheckbox.label ? options.showLeafCheckbox.label : '显示叶子'}</label></div>`;
                }
                if (options.searchable) {
                    var lastSearchValue = options.lastSearchValue,
                        style = '';
                    if (leafCheckbox) {
                        var style = `${' ' + 'style="margin-right:'}${options.showLeafCheckbox.label ? (options.showLeafCheckbox.label.length * 14 + 30) : 90}px"`;
                    }
                    html += `${'<div class="dd-search">'
                        + '<div class="'}${leafCheckbox ? 'dd-left-inputBox' : ''}"${style}>`
                        + `<input type="text" class="form-control search" value="${lastSearchValue || ''}">`
                        + `</div>${
                            leafCheckbox
                        }</div>`;
                } else {
                    html += leafCheckbox;
                }

                if (options.addRootBtn && options.addRootBtn.show) {
                    html += `${'<div class="dd-addRootBtn">'
                            + '<span class="dd-addRootBtn-contend">'
                            + '<i class="'}${options.addRootBtn.class}"></i>`
                            + `<span>${options.addRootBtn.label}</span>`
                            + '</span>'
                            + '</div>';
                }
            }

            html += `<${options.listNodeName} class="${options.listClass}">`;
            html += children;
            html += `</${options.listNodeName}>`;

            return html;
        },
        itemRenderer(item_attrs, content, children, options, item, itemParent) {
            let item_attrs_string = $.map(item_attrs, function (value, key) {
                return ` ${key}="${value}"`;
            }).join(' ');
            item.noAction = item.noAction || item.noaction;
            let rightBtns = '';

            if (item.isRoot) {
                // branchRootRightBtns
                // 增加跟节点不能删除的button group，增加isRoot属性
                rightBtns = `<div class="${options.btnsClass}">`;

                $.each(options.branchRootRightBtns.btnGroup, function (key, btn) {
                    rightBtns += `<button data-action="${key}" class="branchRightBtn">`
                        + `<i class="${btn.class}"></i>`
                        + '</button>';
                });
                rightBtns += '</div>'
            } else if ((item.type == 'branch' || (item.children && item.children.length)) && options.branchRightBtns &&
                options.branchRightBtns.btnGroup && !item.noAction && !(item.editable == false)) {
                // branchRightBtns
                rightBtns = `<div class="${options.btnsClass}">`;

                $.each(options.branchRightBtns.btnGroup, function (key, btn) {
                    if (key == 'checkboxBtn') {
                        rightBtns = `${'<div class="checkbox checkbox-primary display-inline">'
                        + '<input class="dd-checkbox dd-right-checkbox branchRightBtn" type="checkbox"'
                        + 'data-action="'}${key}" ${
                            item.checked ? ' checked="checked" ' : ''
                        }><label></label></div>${
                            rightBtns}`;
                    } else {
                        rightBtns += `<button data-action="${key}" class="branchRightBtn">`
                            + `<i class="${btn.class}"></i>`
                            + '</button>';
                    }
                });
                rightBtns += '</div>'
            } else if ((item.type == 'leaf' || (!item.type && (!item.children || !item.children.length))) && options.leafRightBtns &&
                options.leafRightBtns.btnGroup && !item.noAction && !(item.editable == false)) {
                // leafRightBtns
                rightBtns = `<div class="${options.btnsClass}">`;

                $.each(options.leafRightBtns.btnGroup, function (key, btn) {
                    if (key == 'checkboxBtn') {
                        let disabled = '';
                        if (options.branchRightBtns.btnGroup[key].cascadeChecked && options.branchRightBtns.btnGroup[key].leafDisabled
                            && !item.checked && itemParent && !itemParent.checked) {
                            disabled = 'disabled="disabled"';
                        }
                        rightBtns = `${'<div class="checkbox checkbox-primary display-inline">'
                        + '<input class="dd-checkbox dd-right-checkbox leafRightBtn" type="checkbox"'
                        + 'data-action="'}${key}" ${
                            item.checked ? ' checked="checked" ' : ''}${disabled
                        }><label></label></div>${
                            rightBtns}`;
                    } else {
                        rightBtns += `<button data-action="${key}" class="leafRightBtn">`
                            + `<i class="${btn.class}"></i>`
                            + '</button>';
                    }
                });
                rightBtns += '</div>'
            }

            let checkBox = ''
            if (options.checkBox) {
                let disabled = '';
                if (item.type == 'leaf' && itemParent && itemParent.checked == false) {
                    disabled = 'disabled="disabled"';
                }
                checkBox += `<div class="checkbox checkbox-primary display-inline"><input class="dd-checkbox" type="checkbox"${
                    item.checked ? ' checked="checked" ' : ''}${disabled
                }><label></label></div>`;
            }

            let html = `<${options.itemNodeName}${item_attrs_string}>`;
            html += `<div class="${options.itemContentRowClass}">`;
            html += `${rightBtns + checkBox}<${options.handleNodeName} class="${options.handleClass}">`;
            html += `<${options.contentNodeName} class="${options.contentClass}">`;
            html += content;
            html += `</${options.contentNodeName}>`;
            html += `</${options.handleNodeName}>`;
            html += '</div>';
            html += children;
            html += `</${options.itemNodeName}>`;

            return html;
        }
    };

    function Plugin(element, options) {
        this.w = $(document);
        this.el = $(element);
        options = options || defaults;

        if (options.rootClass !== undefined && options.rootClass !== 'dd') {
            options.listClass = options.listClass ? options.listClass : `${options.rootClass}-list`;
            options.itemClass = options.itemClass ? options.itemClass : `${options.rootClass}-item`;
            options.dragClass = options.dragClass ? options.dragClass : `${options.rootClass}-dragel`;
            options.handleClass = options.handleClass ? options.handleClass : `${options.rootClass}-handle`;
            options.collapsedClass = options.collapsedClass ? options.collapsedClass : `${options.rootClass}-collapsed`;
            options.placeClass = options.placeClass ? options.placeClass : `${options.rootClass}-placeholder`;
            options.noDragClass = options.noDragClass ? options.noDragClass : `${options.rootClass}-nodrag`;
            options.noChildrenClass = options.noChildrenClass ? options.noChildrenClass : `${options.rootClass}-nochildren`;
            options.emptyClass = options.emptyClass ? options.emptyClass : `${options.rootClass}-empty`;
        }

        this.options = $.extend({}, defaults, options);
        let list = this;

        if (list.options.leafRightBtns && list.options.leafRightBtns.btnGroup) {
            $.each(list.options.leafRightBtns.btnGroup, function (key, btn) {
                list.options.leafRightBtns.btnGroup[key] = $.extend(true, {}, leafRightBtns.btnGroup[key], btn);
            });
        }

        if (list.options.branchRightBtns && list.options.branchRightBtns.btnGroup) {
            $.each(list.options.branchRightBtns.btnGroup, function (key, btn) {
                list.options.branchRightBtns.btnGroup[key] = $.extend(true, {}, branchRightBtns.btnGroup[key], btn);
            });
        }

        list.options.addRootBtn = $.extend(true, {}, addRootBtn, list.options.addRootBtn);

        // build HTML from serialized JSON if passed
        if (this.options.json !== undefined) {
            this._build();
        }

        this.init();
    }

    Plugin.prototype = {

        init() {
            let list = this;
            list.reset();
            list.el.data('nestable-group', this.options.group);
            list.el.unbind();

            list.placeEl = $(`<div class="${list.options.placeClass}"/>`);

            // 初始化+-号
            let items = this.el.find(list.options.itemNodeName);
            $.each(items, function (k, el) {
                let item = $(el),
                    parent = item.parent();
                list.setParent(item);
                if (parent.hasClass(list.options.collapsedClass)) {
                    list.collapseItem(parent.parent());
                }
            });

            // Append the .dd-empty div if the list don't have any items on init
            if (!items.length) {
                this.appendEmptyElement(this.el);
            }

            if (list.options.isCollapsedAll) {
                this.collapseAll();
            }

            if (list.options.showLeafCheckbox && !list.options.showLeafCheckbox.value) {
                list.el.find('[data-type="leaf"]').addClass('hidden');
            }

            let firstActiveItem = this.el.find(`${list.options.itemNodeName}.dd-active`);
            if (firstActiveItem.length) {
                firstActiveItem.parentsUntil(list.el, list.options.itemNodeName).each(function () {
                    list.expandItem($(this));
                });
            }

            if (list.el.children(`.${list.options.listClass}`)) {
                let firstListItems = list.el.children(`.${list.options.listClass}`).children(`.${list.options.itemClass}`);
                if (firstListItems.length == 1) {
                    firstListItems.parent().addClass('dd-no-header-line');
                }
            }

            list.el.on('click', 'button', function (e) {
                if (list.dragEl) {
                    return;
                }
                let target = $(e.currentTarget),
                    action = target.data('action'),
                    item = target.parents(list.options.itemNodeName).eq(0);

                if (action === 'collapse') {
                    list.collapseItem(item);
                } else if (action === 'expand') {
                    list.expandItem(item);
                }
            });

            list.el.on('click', '.branchRightBtn', function (e) {
                if (list.dragEl) {
                    return;
                }
                let target = $(e.currentTarget),
                    action = target.data('action'),
                    item = target.parents(list.options.itemNodeName).eq(0),
                    promise = $.Deferred();

                if (action === 'deleteBranchBtn') {
                    promise.promise().then(function (resp) {
                        list.removeItem(item);
                        list.addItemToIsolatedBranch(item);
                    })
                }

                if (action === 'addBranchBtn' || action == 'addLeafBtn') {
                    promise.promise().then(function (resp) {
                        list.addItem(item, resp);

                        // 如果存在未分配组，则处理是否要向从未分配组中删除该选项，如果被添加的选项不属于未分配组的则不删除，反之，删除
                        if (action == 'addLeafBtn') {
                            let isolatedBranch = list.el.find(`.${list.options.isolatedClass}`);
                            if (isolatedBranch.length) {
                                isolatedBranch.find(list.options.itemNodeName).each(function () {
                                    if ($(this).data().ddidentity == resp.ddidentity) {
                                        $(this).remove();
                                    }
                                })
                            }
                        }
                    })
                }

                if (action === 'checkboxBtn' && list.options.branchRightBtns.btnGroup[action].cascadeChecked) {
                    let checked = target.prop('checked');
                    item.data('checked', checked);
                    if (list.options.branchRightBtns.btnGroup[action].asynCheck) {
                        promise.promise().then(function (resp) {
                            list._checkedLeafs(item, checked);
                        })
                    } else {
                        list._checkedLeafs(item, checked);
                    }
                }

                list.options.branchRightBtns.btnGroup[action].onclick.call(list, item, promise, list);
            });

            list.el.on('click', '.leafRightBtn', function (e) {
                if (list.dragEl) {
                    return;
                }
                let target = $(e.currentTarget),
                    action = target.data('action'),
                    item = target.parents(list.options.itemNodeName).eq(0),
                    promise = $.Deferred();

                if (action === 'deleteLeafBtn') {
                    promise.promise().then(function (resp) {
                        list.removeItem(item);

                        list.addItemToIsolatedBranch(item);
                    })
                }

                if (action === 'checkboxBtn' && list.options.leafRightBtns.btnGroup[action].cascadeChecked) {
                    let checked = target.prop('checked');
                    item.data('checked', checked);

                    if (list.options.leafRightBtns.btnGroup[action].asynCheck) {
                        promise.promise().then(function (resp) {
                            list._checkedBranch(item, checked);
                        })
                    } else {
                        list._checkedBranch(item, checked);
                    }
                }


                list.options.leafRightBtns.btnGroup[action].onclick.call(list, item, promise, list);
            });

            list.el.on('click', '.dd-content', function (e) {
                let target = $(e.currentTarget),
                    item = target.parents(list.options.itemNodeName).eq(0),
                    promise = $.Deferred();

                if (item.hasClass('disabled')) {
                    return;
                }

                $('.dd-active').removeClass('dd-active');
                item.addClass('dd-active');

                // 修改选项名称时触发
                promise.promise().then(function (resp) {
                    target.children('span').text(resp);
                })

                list.options.onSelectRow.call(this, item, promise);
            });

            list.el.on('click', '.dd-addRootBtn-contend', function (e) {
                let target = $(e.currentTarget),
                    item = target.parent().next(list.options.listNodeName).eq(0),
                    promise = $.Deferred();
                list.options.addRootBtn.onclick.call(this, item, promise);

                promise.promise().then(function (resp) {
                    list.addItem(item, resp);
                });
            });

            list.el.on('change', '#dd-search-checkbox', function (e) {
                let target = $(e.currentTarget),
                    item = target.parents(list.options.itemNodeName).eq(0);

                let checked = target.prop('checked');
                if (checked) {
                    list.el.find('[data-type="leaf"]').removeClass('hidden');
                } else {
                    list.el.find('[data-type="leaf"]').addClass('hidden');
                }
                // if(list.options.showLeafCheckbox && list.options.showLeafCheckbox.onclick && list.options.showLeafCheckbox.onclick instanceof Function) {
                //     list.options.showLeafCheckbox.onclick.call(list, list.el, checked);
                // }
            });
            list.el.on('keydown', '.search', function (e) {
                if (e.which == 13) {
                    let target = $(e.currentTarget);
                    let value = target.val();
                    if (!list.options.lastSearchValue) {
                        list.options.lastTreeData = JSON.stringify(list.serialize());
                    }
                    list.options.lastSearchValue = value;

                    let data = JSON.parse(list.options.lastTreeData);
                    list.search(list.el, value, data);
                }
            });

            let onStartEvent = function (e) {
                let handle = $(e.target);

                if (handle.hasClass(list.options.contentClass) || handle.parent().hasClass(list.options.contentClass)) {
                    return;
                }
                // if(handle.closest('.' + list.options.btnsClass)) {
                //     return;
                // }
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest(`.${list.options.noDragClass}`).length) {
                        return;
                    }
                    handle = handle.closest(`.${list.options.handleClass}`);
                }
                if (!handle.length || list.dragEl) {
                    return;
                }

                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }

                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };

            let onMoveEvent = function (e) {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(e.touches ? e.touches[0] : e);
                }
            };

            let onEndEvent = function (e) {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(e.touches ? e.changedTouches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener('touchstart', onStartEvent, false);
                window.addEventListener('touchmove', onMoveEvent, false);
                window.addEventListener('touchend', onEndEvent, false);
                window.addEventListener('touchcancel', onEndEvent, false);
            }

            list.el.on('mousedown', onStartEvent);
            list.w.on('mousemove', onMoveEvent);
            list.w.on('mouseup', onEndEvent);

            let destroyNestable = function () {
                if (hasTouch) {
                    list.el[0].removeEventListener('touchstart', onStartEvent, false);
                    window.removeEventListener('touchmove', onMoveEvent, false);
                    window.removeEventListener('touchend', onEndEvent, false);
                    window.removeEventListener('touchcancel', onEndEvent, false);
                }

                list.el.off('mousedown', onStartEvent);
                list.w.off('mousemove', onMoveEvent);
                list.w.off('mouseup', onEndEvent);

                list.el.off('click');
                list.el.unbind('destroy-nestable');

                list.el.data('nestable', null);
            };

            list.el.bind('destroy-nestable', destroyNestable);

        },
        addItemToIsolatedBranch(item) {
            // 如果存在未分配组，则处理是否要向未分配组添加被删除的选项，如果删除的选项是未分配组的则不添加，反之，添加
            let list = this,
                data = item.data(),
                isolatedBranch = list.el.find(`.${list.options.isolatedClass}`);

            if (!isolatedBranch.length) return;

            if (data.type == 'branch') {
                item.find('[data-type="leaf"]').each(function () {
                    let itemData = $(this).data();
                    if (!list.el.find(`[data-ddidentity="${itemData.ddidentity}"]`).length) {
                        list.addItem(isolatedBranch, itemData);
                    }
                })
            } else if (!item.parent().parent().hasClass(list.options.isolatedClass) && !list.el.find(`[data-ddidentity="${data.ddidentity}"]`).length) {
                list.addItem(isolatedBranch, item.data());
            }
        },
        search(el, value, data) {
            let result = [];
            if (value) {
                (function serach(arr) {
                    for (let i = 0; i < arr.length; i++) {
                        if ((`${arr[i].name}`).indexOf(value) != -1) {
                            result.push(arr[i]);
                        } else if (arr[i].children) {
                            serach(arr[i].children);
                        }
                    }
                }(data))
            } else {
                result = data;
            }
            this.options.json = result;
            this.reinit(el, this.options);
        },
        reinit(el, options) {
            el.html('');
            el.data('nestable', new Plugin(el, options));
        },

        destroy() {
            this.el.trigger('destroy-nestable');
        },

        addItem(itemParent, data) {
            let html,
                ol = itemParent.hasClass(this.options.listClass) ? itemParent : itemParent.children(`.${this.options.listClass}`);

            if (ol.hasClass(this.options.listClass)) {
                html = this._buildItem(data, this.options, itemParent);
                if (data.type == 'leaf' && ol.find('[data-type="branch"]').hasClass(this.options.itemClass)) {
                    ol.find('[data-type="branch"]').first().before(html);
                } else {
                    ol.append(html);
                    this.collapseItem(ol.children().last());
                }
            } else {
                html = this._buildList([data], this.options, itemParent);
                itemParent.append(html);
            }

            this.expandItem(itemParent);
        },

        initItemList(itemParent, data) {
            if (!(data instanceof Array) && !itemParent.length) return;
            itemParent.find(this.options.listNodeName).remove();
            let html = this._buildList(data, this.options, itemParent);
            itemParent.append(html);

            this.expandItem(itemParent);
        },

        // addItem: function()

        replace(item) {
            let html = this._buildItem(item, this.options);

            this._getItemById(item.id)
                .replaceWith(html);
        },

        // use fade = 'fade' to fadeout item before removing.
        // by using time(string/msecs), you can control animation speed, default is jq 'slow'
        removeItem(item) {
            item.remove();
            if (this.el.children(`.${this.options.listClass}`)) {
                let firstListItems = this.el.children(`.${this.options.listClass}`).children(`.${this.options.itemClass}`);
                if (firstListItems.length == 1) {
                    firstListItems.parent().addClass('dd-no-header-line');
                }
            }
        },

        _getItemById(itemId, type) {
            if (type) {
                return $(this.el).children(`.${this.options.listClass}`)
                    .find(`[data-id="${itemId}"][data-type="${type}"]`);
            }
            return $(this.el).children(`.${this.options.listClass}`)
                .find(`[data-id="${itemId}"]`);

        },

        _checkedLeafs(li, checked) {
            let list = this;
            let children = li.children(list.options.listNodeName).children(list.options.itemNodeName);
            if (children.length) {
                children.each(function () {
                    if (!$(this).children(list.options.listNodeName).length) {
                        if (checked) {
                            $(this).find('.dd-right-checkbox').prop('checked', true);
                            $(this).find('.dd-right-checkbox').removeAttr('disabled');
                        } else {
                            $(this).find('.dd-right-checkbox').prop('checked', false);
                            $(this).find('.dd-right-checkbox').attr('disabled', 'disabled');
                        }
                    }
                });
            }
        },

        _checkedBranch(li, checked) {
            if (!checked) return;

            let list = this;
            let parent = li.parent().parent();
            parent.children(`.${list.options.itemContentRowClass}`).find('.dd-right-checkbox').prop('checked', true);
        },

        _build() {
            let json = this.options.json;

            if (typeof json === 'string') {
                json = JSON.parse(json);
            }
            $(this.el).html(this._buildList(json, this.options, null));
        },

        _buildList(items, options, itemParent) {
            if (!items) {
                return '';
            }

            let children = '';
            let that = this;


            $.each(items, function (index, sub) {
                children += that._buildItem(sub, options, itemParent);
            });
            return options.listRenderer(children, options, itemParent, that);
        },

        _buildItem(item, options, itemParent) {
            function escapeHtml(text) {
                let map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                };

                return text + ''.replace(/[&<>"']/g, function (m) { return map[m]; });
            }

            function filterClasses(classes) {
                let new_classes = {};

                for (let k in classes) {
                    // Remove duplicates
                    new_classes[classes[k]] = classes[k];
                }

                return new_classes;
            }

            function createClassesString(item, options) {
                let classes = item.classes || {};

                if (typeof classes === 'string') {
                    classes = [classes];
                }

                let item_classes = filterClasses(classes);
                item_classes[options.itemClass] = options.itemClass;

                // create class string
                return $.map(item_classes, function (val) {
                    return val;
                }).join(' ');
            }

            function createDataAttrs(attr) {
                attr = $.extend({}, attr);

                delete attr.children;
                delete attr.classes;
                delete attr.content;

                let data_attrs = {};

                $.each(attr, function (key, value) {
                    if (typeof value === 'object') {
                        value = JSON.stringify(value);
                        value = value.replace(/\"/gi, '\'');
                    }
                    data_attrs[`data-${key}`] = escapeHtml(value);
                });

                return data_attrs;
            }

            function judgeDataLegal(item) {
                let requiredData = ['name', 'type'];
                if (!item) {
                    return false;
                }

                for (let i = 0; i < requiredData.length; i++) {
                    if (!item[requiredData[i]]) {
                        return false;
                    }
                }

                return true;
            }
            if (!judgeDataLegal(item)) {
                alert('数据不合法，每项数据至少包含属性name和type!');
                return;
            }
            let item_attrs = createDataAttrs(item);
            item_attrs.class = createClassesString(item, options);
            if (item.editable == false) {
                item_attrs.class = `${item_attrs.class} disabled`
            }

            let content = `<span>${options.contentCallback(item)}</span>`;
            if (item.iconclass) {
                content = `<i class="m-r-xs ${item.iconclass}"></i>${content}`;
            }
            let children = this._buildList(item.children, options, item);
            let html = $(options.itemRenderer(item_attrs, content, children, options, item, itemParent));

            this.setParent(html);

            return html[0].outerHTML;
        },

        serialize() {
            var data,
                list = this,
                step = function (level) {
                    let array = [],
                        items = level.children(list.options.itemNodeName);
                    items.each(function () {
                        let li = $(this),
                            item = $.extend({}, li.data()),
                            sub = li.children(list.options.listNodeName);

                        if (list.options.includeContent) {
                            let content = li.find(`.${list.options.contentClass}`).html();

                            if (content) {
                                item.content = content;
                            }
                        }

                        if (sub.length) {
                            item.children = step(sub);
                        }
                        array.push(item);
                    });
                    return array;
                };
            data = step(list.el.find(list.options.listNodeName).first());
            return data;
        },

        getCheckedItems() {
            let list = this,
                data = [];
            list.el.find(list.options.itemNodeName).each(function () {
                let li = $(this);
                let inputChecked = li.children(`.${list.options.itemContentRowClass}`).find('.dd-right-checkbox').prop('checked');
                if (inputChecked) {
                    let item = $.extend({}, li.data());
                    data.push(item);
                }
            })

            return data;
        },

        asNestedSet() {
            let list = this,
                o = list.options,
                depth = -1,
                ret = [],
                lft = 1;
            let items = list.el.find(o.listNodeName).first().children(o.itemNodeName);

            items.each(function () {
                lft = traverse(this, depth + 1, lft);
            });

            ret = ret.sort(function (a, b) { return (a.lft - b.lft); });
            return ret;

            function traverse(item, depth, lft) {
                let rgt = lft + 1,
                    id,
                    pid;

                if ($(item).children(o.listNodeName).children(o.itemNodeName).length > 0) {
                    depth++;
                    $(item).children(o.listNodeName).children(o.itemNodeName).each(function () {
                        rgt = traverse($(this), depth, rgt);
                    });
                    depth--;
                }

                id = parseInt($(item).attr('data-id'));
                pid = parseInt($(item).parent(o.listNodeName).parent(o.itemNodeName).attr('data-id')) || '';

                if (id) {
                    ret.push({
                        id, parent_id: pid, depth, lft, rgt
                    });
                }

                lft = rgt + 1;
                return lft;
            }
        },

        returnOptions() {
            return this.options;
        },

        serialise() {
            return this.serialize();
        },

        toHierarchy(options) {

            let o = $.extend({}, this.options, options),
                ret = [];

            $(this.element).children(o.items).each(function () {
                let level = _recursiveItems(this);
                ret.push(level);
            });

            return ret;

            function _recursiveItems(item) {
                let id = ($(item).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
                if (id) {
                    let currentItem = {
                        id: id[2]
                    };
                    if ($(item).children(o.listType).children(o.items).length > 0) {
                        currentItem.children = [];
                        $(item).children(o.listType).children(o.items).each(function () {
                            let level = _recursiveItems(this);
                            currentItem.children.push(level);
                        });
                    }
                    return currentItem;
                }
            }
        },

        toArray() {

            let o = $.extend({}, this.options, this),
                sDepth = o.startDepthCount || 0,
                ret = [],
                left = 2,
                list = this,
                element = list.el.find(list.options.listNodeName).first();

            let items = element.children(list.options.itemNodeName);
            items.each(function () {
                left = _recursiveArray($(this), sDepth + 1, left);
            });

            ret = ret.sort(function (a, b) {
                return (a.left - b.left);
            });

            return ret;

            function _recursiveArray(item, depth, left) {

                let right = left + 1,
                    id,
                    pid;

                if (item.children(o.options.listNodeName).children(o.options.itemNodeName).length > 0) {
                    depth++;
                    item.children(o.options.listNodeName).children(o.options.itemNodeName).each(function () {
                        right = _recursiveArray($(this), depth, right);
                    });
                    depth--;
                }

                id = item.data().id;


                if (depth === sDepth + 1) {
                    pid = o.rootID;
                } else {

                    let parentItem = (item.parent(o.options.listNodeName)
                        .parent(o.options.itemNodeName)
                        .data());
                    pid = parentItem.id;

                }

                if (id) {
                    ret.push({
                        id,
                        parent_id: pid,
                        depth,
                        left,
                        right
                    });
                }

                left = right + 1;
                return left;
            }

        },

        reset() {
            this.mouse = {
                offsetX: 0,
                offsetY: 0,
                startX: 0,
                startY: 0,
                lastX: 0,
                lastY: 0,
                nowX: 0,
                nowY: 0,
                distX: 0,
                distY: 0,
                dirAx: 0,
                dirX: 0,
                dirY: 0,
                lastDirX: 0,
                lastDirY: 0,
                distAxX: 0,
                distAxY: 0
            };
            this.isTouch = false;
            this.moving = false;
            this.dragEl = null;
            this.dragRootEl = null;
            this.dragDepth = 0;
            this.hasNewRoot = false;
            this.pointEl = null;
        },

        expandItem(li) {
            li.removeClass(this.options.collapsedClass);
        },

        collapseItem(li) {
            let lists = li.children(this.options.listNodeName);
            if (lists.length || li.data().type == 'branch') {
                li.addClass(this.options.collapsedClass);
            }
        },

        expandAll() {
            let list = this;
            list.el.find(list.options.itemNodeName).each(function () {
                list.expandItem($(this));
            });
        },

        collapseAll() {
            let list = this;
            list.el.find(list.options.itemNodeName).each(function () {
                list.collapseItem($(this));
            });
        },

        setParent(li) {
            // Check if li is an element of itemNodeName type and has children
            if (li.is(this.options.itemNodeName) && (li.children(this.options.listNodeName).length || li.data().type == 'branch')) {
                // make sure NOT showing two or more sets data-action buttons
                let liContent = li.children(`.${this.options.itemContentRowClass}`);
                liContent.children('[data-action]').remove();
                liContent.prepend($(this.options.expandBtnHTML));
                liContent.prepend($(this.options.collapseBtnHTML));
            }
        },

        unsetParent(li) {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart(e) {
            if (!this.options.draggable) {
                return;
            }

            let mouse = this.mouse,
                target = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            let position = {};
            position.top = e.pageY;
            position.left = e.pageX;

            let continueExecution = this.options.onDragStart.call(this, this.el, dragItem, position);
            // return;
            if (typeof continueExecution !== 'undefined' && continueExecution === false) {
                return;
            }

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.pageX - dragItem.offset().left;
            mouse.offsetY = e.pageY - dragItem.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;
            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(`${this.options.listClass} ${this.options.dragClass}`);
            this.dragEl.css('width', dragItem.outerWidth());
            this.dragParent = dragItem.parent().closest(this.options.itemNodeName);

            this.setIndexOfItem(dragItem);

            // fix for zepto.js
            // dragItem.after(this.placeEl).detach().appendTo(this.dragEl);
            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                left: e.pageX - mouse.offsetX,
                top: e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            let i,
                depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        // Create sublevel.
        //  element : element which become parent
        //  item    : something to place into new sublevel
        createSubLevel(element, item) {
            let list = $(`<${this.options.listNodeName}/>`).addClass(this.options.listClass);
            if (item) list.append(item);
            element.append(list);
            this.setParent(element);
            return list;
        },

        setIndexOfItem(item, index) {
            index = index || [];

            index.unshift(item.index());

            if ($(item[0].parentNode)[0] !== this.dragRootEl[0]) {
                this.setIndexOfItem($(item[0].parentNode), index);
            } else {
                this.dragEl.data('indexOfItem', index);
            }
        },

        restoreItemAtIndex(dragElement, indexArray) {
            let currentEl = this.el,
                lastIndex = indexArray.length - 1;

            // Put drag element at current element position.
            function placeElement(currentEl, dragElement) {
                if (indexArray[lastIndex] === 0) {
                    $(currentEl).prepend(dragElement.clone());
                } else {
                    $(currentEl.children[indexArray[lastIndex] - 1]).after(dragElement.clone());
                }
            }
            // Diggin through indexArray to get home for dragElement.
            for (let i = 0; i < indexArray.length; i++) {
                if (lastIndex === parseInt(i)) {
                    placeElement(currentEl, dragElement);
                    return;
                }
                // element can have no indexes, so we have to use conditional here to avoid errors.
                // if element doesn't exist we defenetly need to add new list.
                let element = (currentEl[0]) ? currentEl[0] : currentEl;
                let nextEl = element.children[indexArray[i]];
                currentEl = (!nextEl) ? this.createSubLevel($(element)) : nextEl;
            }
        },

        dragStop(e) {
            // fix for zepto.js
            // this.placeEl.replaceWith(this.dragEl.children(this.options.itemNodeName + ':first').detach());
            let position = {
                top: e.pageY,
                left: e.pageX
            };
            // Get indexArray of item at drag start.
            let srcIndex = this.dragEl.data('indexOfItem');

            let el = this.dragEl.children(this.options.itemNodeName).first();

            el[0].parentNode.removeChild(el[0]);

            this.dragEl.remove(); // Remove dragEl, cause it can affect on indexing in html collection.

            // Before drag stop callback
            let continueExecution = this.options.beforeDragStop.call(this, this.el, el, this.placeEl.parent());
            if (typeof continueExecution !== 'undefined' && continueExecution === false) {
                let parent = this.placeEl.parent();
                this.placeEl.remove();
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                this.restoreItemAtIndex(el, srcIndex);
                this.reset();
                return;
            }

            this.placeEl.replaceWith(el);

            if (this.hasNewRoot) {
                if (this.options.fixed === true) {
                    this.restoreItemAtIndex(el, srcIndex);
                } else {
                    this.el.trigger('lostItem');
                }
                this.dragRootEl.trigger('gainedItem');
            } else {
                this.dragRootEl.trigger('change');
            }

            this.options.onDragStop.call(this, el.prev(), el, el.next());

            this.reset();
        },

        dragMove(e) {
            let list,
                parent,
                prev,
                next,
                depth,
                opt = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                left: e.pageX - mouse.offsetX,
                top: e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX = e.pageX;
            mouse.nowY = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            let newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx = newAx;
                mouse.moving = true;
                return;
            }

            // do scrolling if enable
            if (opt.scroll) {
                if (typeof window.jQuery.fn.scrollParent !== 'undefined') {
                    var scrolled = false;
                    let scrollParent = this.el.scrollParent()[0];
                    if (scrollParent !== document && scrollParent.tagName !== 'HTML') {
                        if ((opt.scrollTriggers.bottom + scrollParent.offsetHeight) - e.pageY < opt.scrollSensitivity) { scrollParent.scrollTop = scrolled = scrollParent.scrollTop + opt.scrollSpeed; } else if (e.pageY - opt.scrollTriggers.top < opt.scrollSensitivity) { scrollParent.scrollTop = scrolled = scrollParent.scrollTop - opt.scrollSpeed; }

                        if ((opt.scrollTriggers.right + scrollParent.offsetWidth) - e.pageX < opt.scrollSensitivity) { scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + opt.scrollSpeed; } else if (e.pageX - opt.scrollTriggers.left < opt.scrollSensitivity) { scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - opt.scrollSpeed; }
                    } else {
                        if (e.pageY - $(document).scrollTop() < opt.scrollSensitivity) { scrolled = $(document).scrollTop($(document).scrollTop() - opt.scrollSpeed); } else if ($(window).height() - (e.pageY - $(document).scrollTop()) < opt.scrollSensitivity) { scrolled = $(document).scrollTop($(document).scrollTop() + opt.scrollSpeed); }

                        if (e.pageX - $(document).scrollLeft() < opt.scrollSensitivity) { scrolled = $(document).scrollLeft($(document).scrollLeft() - opt.scrollSpeed); } else if ($(window).width() - (e.pageX - $(document).scrollLeft()) < opt.scrollSensitivity) { scrolled = $(document).scrollLeft($(document).scrollLeft() + opt.scrollSpeed); }
                    }
                } else {
                }
            }

            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer);
            }

            if (opt.scroll && scrolled) {
                this.scrollTimer = setTimeout(function () {
                    $(window).trigger(e);
                }, 10);
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold && !opt.sameLevelDraggable && opt.dragNewbranch) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists, is not collapsed, and can have children
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass) && !prev.hasClass(opt.noChildrenClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            this.createSubLevel(prev, this.placeEl);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            let isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }

            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.closest(opt.itemNodeName);
            }

            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            } else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            let pointElRoot = this.pointEl.closest(`.${opt.rootClass}`),
                isNewRoot = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                // if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                //     return;
                // }

                // fixed item's depth, use for some list has specific type, eg:'Volume, Section, Chapter ...'
                if (this.options.fixedDepth && this.dragDepth + 1 !== this.pointEl.parents(opt.listNodeName).length) {
                    return;
                }

                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                let before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                parent = this.placeEl.parent();
                let pointElParent = this.pointEl.parent().closest(opt.itemNodeName);

                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                } else if (opt.sameLevelDraggable ? this.issameLevel(pointElParent, this.dragParent) : true) {
                    if (before) {
                        this.pointEl.before(this.placeEl);
                    } else {
                        this.pointEl.after(this.placeEl);
                    }
                }

                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.appendEmptyElement(this.dragRootEl);
                }
                // parent root list has changed
                this.dragRootEl = pointElRoot;
                if (isNewRoot) {
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        },
        // Append the .dd-empty div to the list so it can be populated and styled
        appendEmptyElement(element) {
            element.append(`<div class="${this.options.emptyClass}"/>`);
        },
        issameLevel(pointElParent, dragElParent) {
            let pointElParentParent = pointElParent.parent().closest(this.options.itemNodeName);
            let itemBoolean1 = dragElParent.hasClass(this.options.itemClass);
            let itemBoolean2 = pointElParent.hasClass(this.options.itemClass);
            let itemBoolean3 = pointElParentParent.hasClass(this.options.itemClass);
            if (itemBoolean1 && itemBoolean2) {
                if (pointElParent.data().id == dragElParent.data().id) {
                    return true;
                }
                this.pointEl = pointElParent;
                return pointElParentParent.data().id == dragElParent.data().id

                return pointElParent.data().id == dragElParent.data().id;
            } else if (!itemBoolean1 && !itemBoolean2) {
                return true;
            } else if (!itemBoolean1 && itemBoolean2 && !itemBoolean3) {
                this.pointEl = pointElParent;
                return true;
            }
            return false;
        }
    };

    $.fn.nestable = function (params) {
        let lists = this,
            retval = this,
            args = arguments;


        if (!('Nestable' in window)) {
            window.Nestable = {};
            Nestable.counter = 0;
        }
        lists.each(function () {
            let plugin = $(this).data('nestable');

            if (!plugin) {
                Nestable.counter++;
                $(this).data('nestable', new Plugin(this, params));
                $(this).data('nestable-id', Nestable.counter);
            } else {
                $(this).children().remove();
                $(this).data('nestable', new Plugin(this, params));
            }
        });

        return retval || lists;
    };

}(window.jQuery || window.Zepto, window, document));
