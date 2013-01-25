Ext.define('ExtZF.view.admin.users.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.adminUsersList',
    store: 'Users', 
    title : '<?php echo $this->title; ?>', // exemplo do título da view passado via PHP
    selModel: {mode: 'MULTI'}, // Permite selecionar mais de uma linha da grid
    tbar :[{
    	text: 'Novo',
        iconCls: 'icon-new',
    	action: 'new' // action identificada para executar na camada controller
    },{
    	text: 'Excluir',
        iconCls: 'icon-delete',
    	action: 'delete'
    }],
	columns: [
        {header: 'Cód.' ,  dataIndex: 'id'      , flex: 0, width:20},
	{header: 'Nome' ,  dataIndex: 'name'    , flex: 3},
        {header: 'E-Mail', dataIndex: 'email'   , flex: 3},
        {header: 'Login',  dataIndex: 'username', flex: 1}
    ],
    // Paginação
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Users',
        dock: 'bottom',
        displayInfo: true
    }]
    
    
});