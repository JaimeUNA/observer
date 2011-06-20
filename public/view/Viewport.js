Ext.define('Js.Viewport', {

    extend: 'Ext.container.Viewport',
    id: 'criaLayout',
    alias: 'myviewport',
    layout: {
        type: 'border',
        padding: 5
    },
    items : [
    {
                
        region: 'north',
        split       : false,
        collapsible : false,
        height      : 57,
        margins     : '0 0 0 0',
        id: 'ctnTop',
                
        tbar        : {
            id          : 'basic-statusbar',
            items       : [
            '<b>OBSERVER - Sistema de Planejamento e Monitoramento da UNASUS</b>',
            '->',{
                text    : '',
                id      : 'text',
                iconCls : 'silk-user'
            },
            'Bem Vindo(a), <span id="main_username" class="username">'+usuario+'</span></b>',
            '-']
        },
        items : {
            xtype : 'mytoolbar'
        }
    },
    {
        
        region: 'west',
        width: 150,
        layout: 'accordion',
        activeItem: 0,
        id: 'ctnLeft',
        items: [
                    
        {
            xtype   : 'panel',
            title   : 'Instrumentos',
            id      : 'pnlInstrumentos',
            layout  : 'fit'
            ,items   : [{xtype:'planoProgramacoesTreePanel'}]
        },{
            xtype: 'panel',
            title: 'Organizações',
            id: 'pnlOrganizacoes'
        }
        ],
        collapsible:true,
        split:true,
        collapseMode : 'header'
    },
    {
        xtype: 'container',
        region: 'center',
        height: 404,
        id: 'ctnCenter',
        layout: 'fit',
        items :
        {
            xtype : 'tabpanel',
            layout:'fit',
            id:'ctnPrincipal',
            items:{
                html:'Bem vindo',
                title:'Home',
                iconCls:'icon-home',
                closable : 'true'
            }
        }
},
{
    region: 'east',
    width: 100,
    id: 'ctnRight',
    collapsible: true,
    collapseMode: "mini",
    split: false
},
{
    xtype: 'container',
    region: 'south',
    height: 46,
    width: 793,
    id: 'ctnBotton'
}
]
});