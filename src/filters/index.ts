import Vue from 'vue';

Vue.filter('json', (value: string) => {
    return JSON.stringify(value, null, '\t');
});

Vue.filter('n2br', (value: string) => {
    return String(value).replace(/(\n|\r\n)/g, '<br>');
});

Vue.filter('addMsg', (msg: string | string[] ): string =>{
    //String(value).replace(/(\n|\r\n)/g, '<br>');
    let resultMsg: string | string[]='';
    if( typeof msg === 'string' ){
        resultMsg=msg.replace(/(\n|\r\n)/g, '<br>');
    }else if (typeof msg === 'object') {
        msg.forEach( ( txt: string ) =>{
            resultMsg+= `<p style="text-align:center;">${ txt }</p>`;
        });
    }
    return resultMsg;
});
