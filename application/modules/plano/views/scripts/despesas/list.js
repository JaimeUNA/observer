Ext.define('ExtZF.view.plano.despesas.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.planoDespesasList', // nome definido para acessar a grid
    store: 'Despesas', // store definido em store/Despesas.js
    title : 'Lista',
    selModel: {mode: 'MULTI'}, // Permite selecionar mais de uma linha da grid
    // botões do cabeçalho
    tbar :[{
    	text: 'Incluir',
        iconCls: 'icon-new',
    	action: 'incluir' // action identificada para executar na camada controller
    },{
    	text: 'Excluir',
        iconCls: 'icon-delete',
    	action: 'excluir'
    }],
	columns: [{header: 'Id.',  dataIndex: 'id',  flex: 0, width: '20'},
		{header: 'Descricao',  dataIndex: 'descricao',  flex: 1},
		{header: ' financeiro_id',  dataIndex: ' financeiro_id',  flex: 1},
		{header: ' valor',  dataIndex: ' valor',  flex: 1}],
    // Paginação
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Despesas',
        dock: 'bottom',
        displayInfo: true
    }]
});