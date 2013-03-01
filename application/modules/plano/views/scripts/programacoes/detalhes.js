
Ext.define('ExtZF.view.plano.programacoes.Detalhes' ,{
    extend      : 'Ext.Panel', 
    alias       : 'widget.planoProgramacoesDetalhes',
    frame       : true,
    border      : false,
    forceFit    : true,
    bodyPadding : 0,
    bodyStyle   : "background: #ffffff;", 
    layout      : {type: 'vbox', align: 'stretch'},
    items       : [{
                    bodyPadding : 7,
                    id      : 'showDetail',
                    html    : ' ',
                    flex    : 2,
                    autoScroll:true
                    },{
                      id    : 'planilhaOrcamentaria',
                      xtype : 'planoProgramacoesGridFinanceiro',
                      flex  : 2,
                      hidden:true,
                      autoscroll: true
                  }]
});


