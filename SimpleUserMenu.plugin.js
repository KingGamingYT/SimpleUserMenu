/**
 * @name SimpleUserMenu
 * @author KingGamingYT
 * @description Simplifies the user panel menu, giving it only the essentials and features it had pre-2024.
 * @version 1.0.2
 */ 

const { Data, Webpack, React, ReactUtils, Patcher, DOM, UI, Utils, ContextMenu } = BdApi;
const { createElement } = React;

const UserModal = Webpack.getByStrings("switch-accounts", "PRESS_SWITCH_ACCOUNTS", { defaultExport: false });
const EmojiRenderer = Webpack.getByStrings('translateSurrogatesToInlineEmoji');
const ActivityStore = Webpack.getStore("PresenceStore");
const Tooltip = Webpack.getModule(Webpack.Filters.byPrototypeKeys("renderTooltip"), { searchExports: true });
const intl = Webpack.getModule(x=>x.t && x.t.formatToMarkdownString);
const closeProfile = Webpack.getByStrings("onCloseProfile:", "trackUserProfileAction:");

const clearClick = (click) => { click.stopPropagation(); Utils.findInTree(ReactUtils.wrapInHooks(closeProfile)({}), r => String(r?.onClick).includes("PRESS_CLEAR_CUSTOM_STATUS")).onClick() };

const TooltipBuilder = ({ note, position, children }) => {
    return (
        React.createElement(Tooltip, {
            text: note,
            position: position || "top",
        }, props => {
            children.props = {
                ...props,
                ...children.props
            };
            return children;
        })
    );
};

const changelog = {
    changelog: [
        {
            "title": "Changes",
            "type" : "improved",
            "items": [
                "Fixed a filtering issue."
            ]
        }
    ]
};

if (!BdApi.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    BdApi.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
        ReactCurrentDispatcher: {
            get current() { 
                return BdApi.React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H; 
            } 
        }
    };
}

function StatusButtonBuilder({user}) {
    const status = ActivityStore.getPrimaryActivity(user.user.id);
    if (status?.type === 4) {
        return createElement('div', { className: "statusItemContainer", style: { display: "flex" }}, 
            [
                status.emoji && createElement(EmojiRenderer, 
                { 
                    emoji: status.emoji 
                }),
                createElement('div', 
                {
                    className: "statusText"}, 
                    status.state
                ),
                createElement(TooltipBuilder, 
                { 
                    note: intl.intl.formatToPlainString(intl.t['3DagBA'])
                }, 
                    createElement('button', 
                    {
                        className: "clearStatusButton", 
                        style: { width: "18px", height: "18px", marginRight: "-7px", backgroundColor: "transparent" }, 
                        onClick: clearClick
                    }, 
                        createElement('svg', 
                        { 
                            style: { fill: "var(--interactive-normal)", width: "18px", height: "18px", marginLeft: "-7px" }
                        }, 
                            createElement('path', 
                                { 
                                    d: "M7.02799 0.333252C3.346 0.333252 0.361328 3.31792 0.361328 6.99992C0.361328 10.6819 3.346 13.6666 7.02799 13.6666C10.71 13.6666 13.6947 10.6819 13.6947 6.99992C13.6947 3.31792 10.7093 0.333252 7.02799 0.333252ZM10.166 9.19525L9.22333 10.1379L7.02799 7.94325L4.83266 10.1379L3.89 9.19525L6.08466 6.99992L3.88933 4.80459L4.832 3.86259L7.02733 6.05792L9.22266 3.86259L10.1653 4.80459L7.97066 6.99992L10.166 9.19525Z", transform: "scale(1.3)" 
                                }
                            )
                        )
                    )
                )
            ]
        ) 
    }
    return createElement('div', { className: "statusItemContainer", style: { display: "flex" }}, 
        [
            createElement('img', 
            { 
                className: "customEmojiPlaceholder", 
                src: "https://discord.com/assets/25acad70d165d46b460754aacfdc388b.svg", 
                style: { width: "18px", height: "18px"}
            }),
            createElement('div', 
            { 
                className: "statusText" }, intl.intl.formatToPlainString(intl.t['/UonHB']
            ))
        ]
    );
}
const styles = Object.assign({},
    Webpack.getByKeys('scroller', 'separator', 'iconContainer'),
    Webpack.getByKeys('statusPickerModalMenu')
);

const panelCSS = webpackify(
    `
        #account-panel {
            margin-left: 3px;
            width: 220px;
            padding-bottom: 8px !important;
            .colorDefault .label {
                color: unset;
            }
        }
        #account-panel > .scroller {
            padding: 6px 0px 0px 8px;
            overflow: unset !important;
            max-width: 216px;
            .expiringStatusMenuItem {
                padding: unset;
                margin-right: 4px;
            }
        }
        #account-panel > div > div.separator {
            width: 188px;
        }
        #account-panel > div > div[role="group"] {
            width: 204px;
        }
        .submenuPaddingContainer {
            padding: unset;
            .statusPickerModalMenu > .scroller {
                padding: 0 !important;
            }
            .statusPickerModalMenu {
                width: 204px;
                height: max-content;
                box-shadow: unset !important;
                border: unset !important;
                background: unset !important;
            }
        }
        .status-picker-custom-status {
            padding: 6px 8px;
            cursor: pointer;
            .statusItemContainer {
                margin: 0 8px;
            }
            .statusText {
                min-width: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                align-self: center;
                flex: 1;
            }
            img {
                width: 16px;
                height: 16px;
                margin-left: -9px;
                padding-right: 10px;
                align-self: center;
            }
        }
        #account-panel-custom-status-picker {
            padding: 0;
            border-radius: 4px;
        }
        #account-panel-custom-status-picker:hover, #account-panel-custom-status-picker:active {
            background: var(--bg-mod-subtle);
            .statusText {
                color: var(--header-primary);
            }
            .clearStatusButton svg:hover {
                fill: var(--interactive-hover) !important;
            }
        }
        :is(#account-panel-switch-accounts, #account-panel-copy-user-id) .iconContainer:nth-of-type(2) {
            order: -1;
            margin-left: unset;
            margin-right: 8px;
        }
        #account-panel-switch-accounts .iconContainer:nth-of-type(2) {
            margin-left: -1px;
        }
        #account-panel-copy-user-id .iconContainer:nth-of-type(2) {
            margin-left: -2px;
        }
    `
)
function webpackify(css) {
    for (const key in styles) {
        let regex = new RegExp(`\\.${key}([\\s,.):>])`, 'g');
        css = css.replace(regex, `.${styles[key]}$1`);
    }
    return css;
}

module.exports  = class SimplePanelPopout {
    constructor(meta){
        this.meta = meta;
        
        const pastVersion = Data.load('SimpleUserMenu', 'version');
        this.shouldDisplayChangelog = typeof pastVersion === 'string' ? pastVersion !== this.meta.version : true;
        Data.save('SimpleUserMenu', 'version', this.meta.version);
    }
    start() {
        if (this.shouldDisplayChangelog) {
                const SCM = UI.showChangelogModal({
                title: this.meta.name + " Changelog",
                subtitle: this.meta.version,
                changes: changelog.changelog,
            });
        }
        DOM.addStyle('panelCSS', panelCSS)
        Patcher.after('SimpleUserMenu', UserModal, "Z", (that, [props], res) => {
            const options = {
                walkable: [
                    'props',
                    'children'
                ],
                ignore: []
            };
            const user = Utils.findInTree(res, (tree) => Object.hasOwn(tree, 'displayProfile'), options);
            const switcher = Utils.findInTree(res, (tree) => tree?.action === "PRESS_SWITCH_ACCOUNTS", options);
            const point = Utils.findInTree(res, (tree) => Object.hasOwn(tree, 'renderSubmenu') && Object.hasOwn(tree, 'sublabel'), options);
            const uID = Utils.findInTree(res, (tree) => tree?.action === "COPY_USER_ID", options);
            
            return [
                createElement(ContextMenu.Menu, {
                    navId: "account-panel",
                    onClose: props.onClose,
                    children: [
                        point.renderSubmenu({closePopout: 0}).props.children,
                        createElement(ContextMenu.Group, {
                            children: [
                                createElement(ContextMenu.Item, {
                                    render() {
                                        return createElement('div', {className: "item status-picker-custom-status", onClick: () => { Utils.findInTree(ReactUtils.wrapInHooks(closeProfile)({}), r => String(r?.onClick).includes("PRESS_EDIT_CUSTOM_STATUS")).onClick() }, children: createElement(StatusButtonBuilder, {user})})
                                    },
                                    id: "custom-status-picker"
                                }),
                                createElement(ContextMenu.Separator),
                                createElement(ContextMenu.Item, {
                                    ...switcher,
                                    action: switcher.onClick,
                                    children: switcher.renderSubmenu({closePopout: props.onClose}).props.children,
                                    id: "switch-accounts"
                                }),
                                uID && [
                                    createElement(ContextMenu.Separator),
                                    createElement(ContextMenu.Item, {
                                        ...uID,
                                        action: uID.onClick
                                    })
                                ]
                            ]
                        })
                    ]
                })
            ]
        })
    }

    stop() {
        Patcher.unpatchAll('SimpleUserMenu');
        DOM.removeStyle('panelCSS');
    }
}