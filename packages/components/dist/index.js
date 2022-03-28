var $6Ag90$react = require("react");
var $6Ag90$proptypes = require("prop-types");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "Flex", () => $e4774276c20de6bd$export$2e2bcd8739ae039);
$parcel$export(module.exports, "FlexItem", () => $0be9104bb37e1c43$export$2e2bcd8739ae039);

function $e4774276c20de6bd$var$Flex(props = {
    vertical: false,
    reverse: false,
    right: false,
    left: false,
    bottom: false,
    top: false,
    yCenter: false,
    xCenter: false,
    center: false,
    wrap: false,
    style: {}
}) {
    const styles = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    };
    if (props.vertical) {
        styles['flexDirection'] = 'column';
        if (props.reverse) styles['flexDirection'] = 'column-reverse';
        if (props.right) styles['alignItems'] = 'flex-end';
        if (props.left) styles['alignItems'] = 'flex-start';
        if (props.bottom) styles['justifyContent'] = 'flex-end';
        if (props.top) styles['justifyContent'] = 'flex-start';
        if (props.yCenter) styles['justifyContent'] = 'center';
        if (props.xCenter || props.center) styles['alignItems'] = 'center';
    } else {
        if (props.reverse) styles['flexDirection'] = 'row-reverse';
        if (props.right) styles['justifyContent'] = 'flex-end';
        if (props.left) styles['justifyContent'] = 'flex-start';
        if (props.bottom) styles['alignItems'] = 'flex-end';
        if (props.top) styles['alignItems'] = 'flex-start';
        if (props.xCenter) styles['justifyContent'] = 'center';
        if (props.yCenter || props.center) styles['alignItems'] = 'center';
    }
    if (props.wrap) styles['flexWrap'] = 'wrap';
    return /*#__PURE__*/ ($parcel$interopDefault($6Ag90$react)).createElement("div", {
        style: {
            ...styles,
            ...props.style
        }
    }, props.children);
}
var $e4774276c20de6bd$export$2e2bcd8739ae039 = $e4774276c20de6bd$var$Flex;




function $0be9104bb37e1c43$var$FlexItem(props) {
    const styles = {};
    if (props.flex) styles['display'] = 'flex';
    if (props.right) styles['alignSelf'] = 'flex-end';
    if (props.left) styles['alignSelf'] = 'flex-start';
    if (props.stretch) styles['alignSelf'] = 'stretch';
    if (props.center) styles['alignSelf'] = 'center';
    if (props.grow) styles['flexGrow'] = 1;
    if (props.shrink) styles['flexShrink'] = 1;
    if (props.first) styles['order'] = '-9999';
    if (props.nth) styles['order'] = props.nth;
    return /*#__PURE__*/ ($parcel$interopDefault($6Ag90$react)).createElement("div", {
        style: {
            ...styles,
            ...props.style
        }
    }, props.children);
}
$0be9104bb37e1c43$var$FlexItem.defaultProps = {
    flex: false,
    right: false,
    left: false,
    shrink: false,
    center: false,
    stretch: false,
    first: false,
    last: false,
    grow: false,
    nth: null,
    style: {}
};
$0be9104bb37e1c43$var$FlexItem.propTypes = {
    right: ($parcel$interopDefault($6Ag90$proptypes)).bool,
    left: ($parcel$interopDefault($6Ag90$proptypes)).bool,
    shrink: ($parcel$interopDefault($6Ag90$proptypes)).bool,
    center: ($parcel$interopDefault($6Ag90$proptypes)).bool,
    stretch: ($parcel$interopDefault($6Ag90$proptypes)).bool,
    first: ($parcel$interopDefault($6Ag90$proptypes)).bool,
    last: ($parcel$interopDefault($6Ag90$proptypes)).bool,
    grow: ($parcel$interopDefault($6Ag90$proptypes)).bool,
    nth: ($parcel$interopDefault($6Ag90$proptypes)).any,
    style: ($parcel$interopDefault($6Ag90$proptypes)).object
};
var $0be9104bb37e1c43$export$2e2bcd8739ae039 = $0be9104bb37e1c43$var$FlexItem;




//# sourceMappingURL=index.js.map
