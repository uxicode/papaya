import Vue from 'vue';

Vue.filter('json',  (value) => {
    return JSON.stringify( value, null, '\t');
});

Vue.filter('n2br', (value) => {
    return String( value ).replace(/(\n|\r\n)/g, '<br>');
})
